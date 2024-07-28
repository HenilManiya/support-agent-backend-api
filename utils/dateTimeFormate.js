module.exports.formatter = {
    dateTimeFormat: async function (filterType, date) {
        const parsedDate = new Date(date);
        let startDate, endDate;

        switch (filterType) {
            case 'Day':
                startDate = new Date(Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate(), 0, 0, 0, 0));
                endDate = new Date(Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate(), 23, 59, 59, 999));
                break;
            case 'Month':
                startDate = new Date(Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), 1, 0, 0, 0, 0));
                endDate = new Date(Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth() + 1, 0, 23, 59, 59, 999));
                break;
            case 'Year':
                startDate = new Date(Date.UTC(parsedDate.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
                endDate = new Date(Date.UTC(parsedDate.getUTCFullYear(), 11, 31, 23, 59, 59, 999));
                break;
            default:
                throw new Error('Invalid filterType');
        }
        return { startDate, endDate }
    }
}   