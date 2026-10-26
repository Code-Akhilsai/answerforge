const getHome = (req, res) => {
  res.status(200).json({ message: "Welcome to ExpressLaunch" });
};
export default getHome;
