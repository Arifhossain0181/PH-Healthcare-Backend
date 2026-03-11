import catchAsync from "../../shared/catchAsync";
import { StatsService } from "./stats.service";
import { Response, Request } from "express";
const getdashboardstatsdata = catchAsync(async(req: Request, res: Response) => {
    const user = req.user;
    const result = await StatsService.getdashboardstats(user);
    res.status(200).json({
        success: true,
        message: "Stats data fetched successfully",
        data: result,
    });

})
export const StatsController = {
    getdashboardstatsdata
}