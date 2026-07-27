import { type RequestHandler } from "express";
import { HttpError } from "./HttpError";

export const notFound: RequestHandler = (_req,_res, next)=>{
    const error = new HttpError(404,"ROUTE_NOT_FOUND", "Route not found")
    next(error)
}