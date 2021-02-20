import { Request, Response } from "express";
import axios from "axios";
import { filterImageFromURL, deleteLocalFiles } from "../util/util";

const callUrlForTesting = async (image_url: string) => {
  try {
    const callUrlForTesting = await axios.get(image_url);
    return callUrlForTesting.status;
  } catch (err) {
    return 404;
  }
};

export const getFilteredImage = async (req: Request, res: Response) => {
  const { image_url } = req.query;
  try {
    const isImageAvailable = await callUrlForTesting(image_url);
    if (isImageAvailable !== 200)
      throw { status: 404, message: "failed to find image from URL" };
    const filteredImagePath = await filterImageFromURL(image_url);
    res.status(200).sendFile(filteredImagePath);
    return setTimeout(() => deleteLocalFiles([filteredImagePath]), 1000)
  } catch (err) {
    console.error(err);
    return res.status(err.status ? err.status : 500).send(err);
  } finally {
  }
};
