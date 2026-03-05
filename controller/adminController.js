import Order from '../models/Order.js';


// logic: i am gonna make an analytics controller for my admin dashboard. 
// i will also use this later when i install rechart later in my frontend. 
// the idea is that i need to fetch all the orders and group them by date so that frontend recharts library can draw a graph of daily sales.
// https://github.com/ed-roh/fullstack-admin
// https://www.youtube.com/watch?v=XnbUHzZkypQ
// https://stackoverflow.com/questions/73867289/mongoose-how-to-find-sales-quantities-of-specific-items-in-an-orders-table

export const getSalesData = async (req, res, next) => {
    try {
        // logic: using mongodbs aggregation here. did similar for admin dashboard in sba 319
        const salesData = await Order.aggregate([
            {
                // logic: group the documents by the date they were created. i am formatting it to yyyy-mm-dd so the chart will look clean later.
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalRevenue: { $sum: "$totalPrice" },
                    orderCount: { $sum: 1 }
                }
            },
            {
                // logic: sorting by date ascending so the graph goes from oldest to newest.
                $sort: { _id: 1 }
            }
        ]);

        ////////////TESTING
        // console.log(`TESTING: generated analytics for ${salesData.length} days of sales`);
        ////////////

        res.status(200).json(salesData);
    } catch (error) {
        next(error);
    }
};