import React, { useState, useEffect } from "react";
import { NavLink, Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { spots } from "../../store/spots";
import "./Spot.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Spot = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [calendar, setCalendar] = useState(new Date());
  const sessionUser = useSelector((state) => state.spots);
  const bookings = [];

  const createBookings = (start, end) => {
    bookings.push(new Date(start));
    if (
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate()
    )
      return;
    start.setDate(start.getDate() + 1);
    createBookings(new Date(start), end);
  };
  if (isLoaded) {
    sessionUser.spot.Bookings.forEach((booking) => {
      createBookings(new Date(booking.startDate), new Date(booking.endDate));
    });
  }

  useEffect(() => {
    dispatch(spots({ spotId })).then(() => setIsLoaded(true));
  }, [dispatch]);

  const disableTiles = ({ date, view }) => {
    return (
      view === "month" && // Block day tiles only
      bookings.some(
        (disabledDate) =>
          date.getFullYear() === disabledDate.getFullYear() &&
          date.getMonth() === disabledDate.getMonth() &&
          date.getDate() === disabledDate.getDate()
      )
    );
  };
  return (
    isLoaded && (
      <div className="spot-container">
        <div>
          <h2 className="title">{sessionUser.spot.body}</h2>
        </div>
        <div className="images-container">
          {sessionUser.spot.Images.map((image) => {
            return (
              <div className="house-image">
                <img
                  className="house-image"
                  src={image.imageUrl}
                  style={{ height: "auto", width: "240px" }}
                />
              </div>
            );
          })}
        </div>
        <div className="house-info">
          <div className="hosted-by">
            <div className="host-details">
              <div style={{ fontSize: "25px" }}>
                Entire {sessionUser.spot.Home.type} hosted by{" "}
                {sessionUser.spot.User.firstName}
              </div>
              <div>
                <div>
                  {sessionUser.spot.Home.guest} guests{" "}
                  {sessionUser.spot.Home.bed} bed {sessionUser.spot.Home.bath}{" "}
                  bath
                </div>
              </div>
            </div>
            <div className="profile-pic ">
              <img
                src={sessionUser.spot.User.profilePic}
                style={{ height: "60px", width: "60px", borderRadius: "50%" }}
              />
            </div>
          </div>
          <div>
            <div>
              <div>
                <Calendar
                  tileDisabled={disableTiles}
                  value={calendar}
                  onChange={setCalendar}
                  selectRange={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Spot;
