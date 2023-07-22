const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.json());

// Get tours data from json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Response Handler Functions
const getAllTours = (request, response) => {
  response.status(200).json({
    status: "success",
    result: tours.length,
    data: {
      tours,
    },
  });
};

const addNewTour = (request, response) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, request.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        console.log("Error while writing data in file");
      } else {
        response.status(201).json({
          status: "success",
          data: {
            newTour,
          },
        });
      }
    }
  );
};

const getOneTour = (request, response) => {
  const id = request.params.id * 1;
  const tourToGet = tours.find((tour) => tour.id === id);
  // if tourToGet is undefined
  if (!tourToGet) {
    response.status(404).json({
      status: "fail",
      messgae: "Invalid ID",
    });
  } else {
    response.status(200).json({
      status: "success",
      data: {
        tour: tourToGet,
      },
    });
  }
};

const updateOneTour = (requset, response) => {
  const id = requset.params.id * 1;
  const tourToUpdate = tours.find((tour) => tour.id === id);

  // if tourToUpdate is "undefined"
  if (!tourToUpdate) {
    response.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  } else {
    const updatedTour = Object.assign(tourToUpdate, requset.body);
    response.status(200).json({
      status: "success",
      data: {
        tour: updatedTour,
      },
    });
  }
};

const deleteOneTour = (request, response) => {
  const id = request.params.id * 1;
  const tourToDelete = tours.find((tour) => tour.id === id);
  const index = tours.indexOf(tourToDelete);
  // if tourToDelete is "undefined"
  if (!tourToDelete) {
    response.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  } else {
    tours.splice(index, 1);
    fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(tours),
      (err) => {
        if (err) {
          console.log("Error while writing data in file");
        } else {
          response.status(204).json({
            status: "success",
            data: null,
          });
        }
      }
    );
  }
};

app
    .route("/api/v1/tours")
    .get(getAllTours)
    .post(addNewTour);
app
  .route("/api/v1/tours/:id")
  .get(getOneTour)
  .patch(updateOneTour)
  .delete(deleteOneTour);

const port = 4200;

app.listen(4200, () => {
  console.log(`Server is running on port ${port}`);
});
