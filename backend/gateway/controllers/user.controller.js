export const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    res
      .status(500)
      .json({ success: false, message: error.message });
  }
};
