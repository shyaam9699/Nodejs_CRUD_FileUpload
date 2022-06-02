const db = require("../database/models");
const Op = db.Sequelize.Op;
const EventsModel = db.Events;
const TAG = "Events";

const getEventsById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await EventsModel.findOne({
      where: {
        Id: id,
        IsActive: true,
        IsDeleted: false,
      },
    });
    if (!data)
      return res
        .status(200)
        .json({
          responseStatus: false,
          responseMessage: `No Events found with given id ${id}`,
        });

    return res
      .status(200)
      .send({
        responseStatus: true,
        responseMessage: "Events data found",
        data,
      });
  } catch (err) {
    console.log({ err }, `${TAG} getEventsById`);
    return res.status(500).json({
      responseMessage: err.message || "Oops! something went wrong...",
    });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const { limit, offset, startDate, endDate, sortBy, sort } = req.query;
    let query = {};
    query.where = {};
    if (limit) query.limit = +limit;
    if (offset) query.offset = +offset;
    if (sortBy && sort) query.order = [[sortBy, sort]];

    if (startDate && endDate)
      query.where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };

    query.where = {
      //IsActive: true,
      IsDeleted: false,
    };

    const { rows, count } = await EventsModel.findAndCountAll(query);

    if (count == 0)
      return res
        .status(200)
        .json({ responseStatus: false, responseMessage: `No events found` });

    return res.status(200).json({
        responseStatus:true,
        responseMessage: `Event list found`,
      total: count,
      data: rows,
    });
  } catch (err) {
    console.log({ err }, `${TAG} getAllEvents`);
    return res.status(500).json({
      responseMessage: err.message || "Oops! something went wrong...",
    });
  }
};

const addEvents = async (req, res) => {
  try {
    const { name, location, startDate, endDate } = req.body;

    if (!name)
      return res
        .status(400)
        .json({ responseStatus: false, responseMessage: `Name missing` });
    if (!location)
      return res
        .status(400)
        .json({
          responseStatus: false,
          responseMessage: `description missing`,
        });
    if (!startDate)
      return res
        .status(400)
        .json({ responseStatus: false, responseMessage: `startDate missing` });
    if (!endDate)
      return res
        .status(400)
        .json({ responseStatus: false, responseMessage: `endDate missing` });

    const event = await EventsModel.create({
      Name: name,
      Location: location,
      StartDate: startDate,
      EndDate: endDate,
    });

    if(!event)throw new Error("Events add failed");

    return res
      .status(200)
      .json({
          id:event.Id,
        responseStatus: true,
        responseMessage: "Events added successfully",
      });
  } catch (err) {
    console.log({ err }, `${TAG} addEvents`);
    return res.status(500).json({
      responseMessage: err.message || "Oops! something went wrong...",
    });
  }
};

const updateEvents = async (req, res) => {
  try {
    const { id, name, location, startDate, endDate,isActive } = req.body;

    if (!id)
      return res
        .status(400)
        .json({ responseStatus: false, responseMessage: `Id is required` });

        if (!name)
      return res
        .status(400)
        .json({ responseStatus: false, responseMessage: `name is required` });

        if (!location)
        return res
          .status(400)
          .json({ responseStatus: false, responseMessage: `location is required` });

          if (!startDate)
          return res
            .status(400)
            .json({ responseStatus: false, responseMessage: `startDate is required` });

            if (!endDate)
          return res
            .status(400)
            .json({ responseStatus: false, responseMessage: `endDate is required` });


    const events = await EventsModel.findOne({
      where: {
        Id: id,
        //IsActive: true,
        IsDeleted: false,
      },
    });

    if (!events)
      return res
        .status(200)
        .json({ responseStatus: false, responseMessage: `No events found` });

    if (name) events.Name = name;
    if (location) events.Location = location;
    if (startDate) events.StartDate = startDate;
    if (endDate) events.EndDate = endDate;
    //if (filepath) events.Filepath = filepath;
    if (isActive==true||isActive==false)events.IsActive = isActive;

    await events.save();

    return res
      .status(200)
      .json({
          id:id,
        responseStatus: true,
        responseMessage: "Events updated successfully",
      });
  } catch (err) {
    console.log({ err }, `${TAG} updateEvents`);
    return res.status(500).json({
      responseMessage: err.message || "Oops! something went wrong...",
    });
  }
};

const deleteEvents = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ responseStatus: false, responseMessage: "Id is empty" });
    const data = await EventsModel.findOne({
      where: {
        Id: id,
        //IsActive: true,
        IsDeleted: false,
      },
    });
    if (!data)
      return res
        .status(200)
        .json({ responseStatus: false, responseMessage: "No Events data found" });
    data.IsActive = false;
    data.IsDeleted = true;
    await data.save();
    return res
      .status(200)
      .json({
        responseStatus: true,
        responseMessage: "Events deleted successfully",
      });
  } catch (error) {
    console.log({ err }, `${TAG} deleteEvents`);
    return res
      .status(500)
      .json({ responseStatus: false, responseMessage: error.message });
  }
};

const deleteMultipleEvents = async (req, res) => {
    try {
      const { selectedEvents } = req.body;
      if (selectedEvents.length==0)
        return res
          .status(400)
          .json({ responseStatus: false, responseMessage: "Selected Events are empty" });
      const data = await EventsModel.update({
          IsActive:false,
          IsDeleted:true
      },{
        where: {
          Id: selectedEvents,
        },
      });
      if (!data)
        throw new Error('Events Delete failed')

      return res
        .status(200)
        .json({
          responseStatus: true,
          responseMessage: "Events deleted successfully",
        });
    } catch (error) {
      console.log({ error }, `${TAG} deleteMultipleEvents`);
      return res
        .status(500)
        .json({ responseStatus: false, responseMessage: error.message });
    }
  };
const uploadDocuments = async (req, res) => {
    try {
        const {files}= req;
      const { id } = req.params;
      if (!id)
        return res
          .status(400)
          .json({ responseStatus: false, responseMessage: "Id is empty" });
          if(!files)
          return res
          .status(400)
          .json({ responseStatus: false, responseMessage: "file is required" });
          
      const data = await EventsModel.findOne({
        where: {
          Id: id,
        },
      });
      if (!data)
        return res
          .status(200)
          .json({ responseStatus: false, responseMessage: "No Event data found" });
          const myFile = req.files.file;

          let timestamp=Date.now()

    //  mv() method places the file inside public directory

    myFile.mv(`${process.cwd()}/public/docs/${timestamp}${myFile.name}`, async (err)=> {
        if (err) {
            console.log(err)
            //return res.status(500).send({ msg: "Error occured" });
        }
        data.FilePath = `${timestamp}${myFile.name}`;
        await data.save();
        return res
          .status(200)
          .json({
            responseStatus: true,
            responseMessage: "Events deleted successfully",
          });
        // returing the response with file path and name
       // return res.send({name: `${timestamp}${myFile.name}`, path: `/${timestamp}${myFile.name}`});
    });

    } catch (error) {
      console.log({ err }, `${TAG} deleteEvents`);
      return res
        .status(500)
        .json({ responseStatus: false, responseMessage: error.message });
    }
  };
module.exports = {
  getEventsById,
  getAllEvents,
  addEvents,
  updateEvents,
  deleteEvents,
  deleteMultipleEvents,
  uploadDocuments
};
