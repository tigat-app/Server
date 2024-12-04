import { Request, Response } from "express";
import Community from "../models/community"; // Adjust the import path as necessary

// Create a new community
export const createCommunity = async (req: Request, res: Response) => {
  try {
    const { courseId, lectureId, lectureName, url, groupName } = req.body;

    const newCommunity = new Community({
      courseId,
      lectureId,
      lectureName,
      url,
      groupName,
    });

    const savedCommunity = await newCommunity.save();
    res.status(201).json(savedCommunity);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all communities
export const getAllCommunities = async (req: Request, res: Response) => {
  try {
    const communities = await Community.find().populate("courseId");
    res.status(200).json(communities);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get communities by courseId
export const getCommunitiesByCourseId = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    const communities = await Community.find({ courseId }).populate("courseId");

    if (!communities.length) {
      return res
        .status(404)
        .json({ message: "No communities found for this courseId" });
    }

    res.status(200).json(communities);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get a community by ID
export const getCommunityById = async (req: Request, res: Response) => {
  try {
    const communityId = req.params.id;
    const community = await Community.findById(communityId).populate(
      "courseId"
    );

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.status(200).json(community);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update a community by ID
export const updateCommunity = async (req: Request, res: Response) => {
  try {
    const communityId = req.params.id;
    const updateData = req.body;

    const updatedCommunity = await Community.findByIdAndUpdate(
      communityId,
      updateData,
      { new: true }
    );

    if (!updatedCommunity) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.status(200).json(updatedCommunity);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a community by ID
export const deleteCommunity = async (req: Request, res: Response) => {
  try {
    const communityId = req.params.id;
    const deletedCommunity = await Community.findByIdAndDelete(communityId);

    if (!deletedCommunity) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.status(200).json({ message: "Community deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};