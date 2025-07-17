const { TourStep, TourDetails } = require("../schemas/model");

const { Types } = require("mongoose"); // To get ObjectId safely

const DEFAULT_USER_ID = "687521d8a306254ddb9fd34d"; // your default userId

exports.saveTourSteps = async (req, res) => {
  try {
    const { steps, url, name } = req.body;
    const { id } = req.user;

    if (!Array.isArray(steps) || !url) {
      return res.status(400).json({ message: "Missing steps or url" });
    }
    const saveTourDetails = await TourDetails.create({
      name: name || url,
      url: url,
      createdBy: id,
    });
    const savedSteps = await TourStep.insertMany(
      steps.map((step) => ({
        tourId: saveTourDetails?.id,
        url: step?.url,
        message: step.message,
        outerHTML: step.outerHTML,
        timestamp: step.timestamp,
      }))
    );

    return res
      .status(201)
      .json({ message: "Tour saved successfully", steps: savedSteps });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ message: "Error saving tour steps" });
  }
};

exports.getTourStepsByUrl = async (req, res) => {
  try {
    const { tourId, url } = req.query;
    if (!tourId) return res.status(400).json({ message: "Missing Api Key" });

    const tourStep = await TourStep.find({ tourId: tourId });
    res.status(200).json({ steps: tourStep });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tour steps" });
  }
};

// exports.getTourDetails = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) return res.status(400).json({ message: "Missing Api Key" });

//     const tourDetails = await TourDetails.find({
//       createdBy: id,
//     });
//     res.status(200).json({ data: tourDetails });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch tour steps" });
//   }
// };

exports.getTourDetails = async (req, res) => {
  try {
    const { id } = req.user;
    const { isTour } = req.query;
    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Missing or invalid API key" });
    }
    const pipeline = [
      {
        $match: {
          createdBy: new Types.ObjectId(id),
        },
      },
    ];

    if (isTour === "true") {
      pipeline.push({
        $lookup: {
          from: "tourStep", // MongoDB collection name (Mongoose auto-pluralizes model names)
          localField: "_id",
          foreignField: "tourId",
          as: "steps",
        },
      });
    }

    const tourDetails = await TourDetails.aggregate(pipeline);

    res.status(200).json({ data: tourDetails });
  } catch (err) {
    console.error("Aggregation error:", err);
    res.status(500).json({ message: "Failed to fetch tour details" });
  }
};
exports.getTourDetailsScript = async (req, res) => {
  try {
    const { isTour, createdBy, url } = req.query;
    console.log(createdBy, url, "createdBy, url");
    if (!createdBy || !Types.ObjectId.isValid(createdBy)) {
      return res.status(400).json({ message: "Missing or invalid API key" });
    }

    const pipeline = [
      {
        $match: {
          createdBy: new Types.ObjectId(createdBy),
          ...(url ? { url: url } : {}),
        },
      },
      {
        $lookup: {
          from: "tourStep", // MongoDB collection name (Mongoose auto-pluralizes model names)
          localField: "_id",
          foreignField: "tourId",
          as: "steps",
        },
      },
    ];
    const tourDetails = await TourDetails.aggregate(pipeline);

    res.status(200).json({ data: tourDetails });
  } catch (err) {
    console.error("Aggregation error:", err);
    res.status(500).json({ message: "Failed to fetch tour details" });
  }
};

exports.updateTourStep = async (req, res) => {
  try {
    const { stepId } = req.params;
    const { message } = req.body;

    if (!stepId || !Types.ObjectId.isValid(stepId)) {
      return res.status(400).json({ message: "Invalid or missing step ID" });
    }

    const updateData = {};
    if (message !== undefined) updateData.message = message;

    const updatedStep = await TourStep.findByIdAndUpdate(
      stepId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedStep) {
      return res.status(404).json({ message: "Tour step not found" });
    }

    return res.status(200).json({
      message: "Tour step updated successfully",
      step: updatedStep,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update tour step" });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const { tourId } = req.params;

    if (!tourId || !Types.ObjectId.isValid(tourId)) {
      return res.status(400).json({ message: "Invalid or missing tour ID" });
    }

    // Check if tour exists
    const existingTour = await TourDetails.findById(tourId);
    if (!existingTour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    // Delete related steps
    await TourStep.deleteMany({ tourId });

    // Delete the tour
    await TourDetails.findByIdAndDelete(tourId);

    return res
      .status(200)
      .json({ message: "Tour and associated steps deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ message: "Failed to delete tour" });
  }
};
