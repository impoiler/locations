import { Request, Response, Router } from "express";
import utilResponse from "../utils/Response";
import Error from "../utils/Error";
import prisma from "../db/prisma";
import { Prisma } from "@prisma/client";
const router = Router();

interface Query {
  type: "country" | "state" | "district" | "subdistrict"
  id: string
}

const allowdTypes = ["country", "state", "district", "subdistrict"]

router.get("/", async (req: Request, res: Response) => {
  if (!req.query.type || req.query.type !== "country" && !req.query.id) {
    return Error(res, "Pass type and id to see the result", 400)
  }

  const Q = {
    type: req.query.type,
    id: req.query.id
  } as Query

  if (!allowdTypes.includes(Q.type)) {
    return Error(res, "Allowd type are - state, disctict, subdistrict", 400)
  }

  try {
    let data



    switch (Q.type) {
      case "country":

        data = await prisma.state.findMany(
        )
        break;

      case "state":
        data = await prisma.state.findUnique({
          where: {
            id: Q.id
          }, include: {
            districts: true
          }
        })
        break;

      case "district":
        data = await prisma.district.findUnique({
          where: {
            id: Q.id
          }, include: {
            subDistricts: true
          }
        })
        break;



      case "subdistrict":
        data = await prisma.subDistrict.findUnique({
          where: {
            id: Q.id
          }, include: {
            villages: true
          }
        })
        break;



      default:
        return Error(res, "Something went wrong!", 400)
    }

    utilResponse(res, data || [], 200)
  } catch (error) {
    Error(res, error, 400);
  }
});

export default router;
