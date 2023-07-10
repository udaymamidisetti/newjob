import React, { useState, useEffect } from "react";
import ImageGallery from "react-image-gallery";
import { DateTime } from "luxon";
import axios from "axios";
import "./ImageSlider.css";
import SettingsIcon from "@mui/icons-material/Settings";
import { ClipLoader } from "react-spinners";
const ImageSlider = () => {
  let todayDate = DateTime.now().toFormat("yyyy-MM-dd");
  const [fromTime, setFromTime] = useState("00:00");
  const [toTime, setToTime] = useState("23:00");
  const [dropdown, setDropdown] = useState(false);
  const [playback, setPlayback] = useState(500);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(todayDate);
  const [data, setData] = useState([]);
  const mergedates = `${date + " " + fromTime}`;
  const mergeTotime = `${date + " " + toTime}`;
  const [startTime, setStartTime] = useState("00:00");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [id, setId] = useState(5);
  // console.log(mergedates);
  // console.log(mergeTotime);
  // useEffect(() => {
  //   const fetchData2 = async () => {
  //     console.log("First function is running");
  //     try {
  //       const response = await axios.request(
  //         `https://jobmanager.in/react-api.php?from_date=${mergedates}&to_date=${mergeTotime}&uid=${id}&offset=${offset}`
  //       );
  //       const jsonData = await response.data;
  //       console.log(jsonData);
  //       if (typeof jsonData === "object") {
  //         const updatedArray = Object.keys(jsonData).map((key) => {
  //           const updatedDateTime = updatedDate(jsonData[key].date_info);
  //           const updatedScreenshot = updatedScreenshotValue(
  //             jsonData[key].screenshot
  //           );
  //           return {
  //             screenshot: updatedScreenshot,
  //             date_info: updatedDateTime,
  //           };
  //         });
  //         setTotalCount(jsonData.total_records);
  //         function updatedScreenshotValue(screenshot) {
  //           return screenshot;
  //         }
  //         function updatedDate(date_info) {
  //           return date_info;
  //         }
  //         const galleryImages = updatedArray
  //           .slice(0, updatedArray.length - 3)
  //           .map((image) => ({
  //             original: image.screenshot,
  //             time: image.date_info,
  //           }));
  //         setData((prevData) => [...prevData, ...galleryImages]);
  //         console.log(...galleryImages);
  //         setOffset((p) => p + 50);
  //       } else if (typeof jsonData === "string") {
  //         setData(jsonData);
  //         setLoading(true);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   // if (offset <= totalCount) {
  //   //   fetchData2();
  //   // }
  // }, [offset]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if ((currentIndex + 1) % 10 === 5 && !isPaused && offset <= totalCount) {
      fetchData();
    }
  }, [currentIndex, isPaused]);

  const fetchData = async () => {
    // const iframe = document.querySelector("iframe");
    //   const iframeSrc = iframe.src;
    //   const url = new URL(iframeSrc);
    //   const params = new URLSearchParams(url.search);
    //   const param1 = params.get("user");
    //   console.log(param1);
    //   setId(param1);
    const params = new URLSearchParams(window.location.search);
    const user = params.get("user");
    // console.log(user);
    // setId(user);
    try {
      const response = await axios.request(
        `https://jobmanager.in/react-api.php?from_date=${mergedates}&to_date=${mergeTotime}&uid=${id}&offset=${offset}`
      );
      const jsonData = await response.data;
      console.log(jsonData);
      if (typeof jsonData === "object") {
        const updatedArray = Object.keys(jsonData).map((key) => {
          const updatedDateTime = updatedDate(jsonData[key].date_info);
          const updatedScreenshot = updatedScreenshotValue(
            jsonData[key].screenshot
          );
          return {
            screenshot: updatedScreenshot,
            date_info: updatedDateTime,
          };
        });
        const fistImageTime = jsonData.first;
        const lastImageTime = jsonData.last;
        setTotalCount(jsonData.total_records);
        function updatedScreenshotValue(screenshot) {
          return screenshot;
        }
        function updatedDate(date_info) {
          return date_info;
        }
        const getTimeFromDatetime = (datetime) => {
          const datetimeObj = DateTime.fromFormat(
            datetime,
            "MMMM dd, yyyy hh:mm:ss a"
          );
          return datetimeObj.toFormat("HH:mm");
        };
        setStartTime(getTimeFromDatetime(fistImageTime));
        setFromTime(getTimeFromDatetime(fistImageTime));
        setToTime(getTimeFromDatetime(lastImageTime));
        // console.log(fistImageTime);
        // console.log(lastImageTime);
        const galleryImages = updatedArray
          .slice(0, updatedArray.length - 3)
          .map((image) => ({
            original: image.screenshot,
            time: image.date_info,
          }));
        // console.log(galleryImages);
        setData((prevData) => [...prevData, ...galleryImages]);
        setOffset((p) => p + 10);
        // console.log(...galleryImages);
        setLoading(true);
      } else if (typeof jsonData === "string") {
        setData(jsonData);
        setLoading(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const filteringData = async () => {
    // const { user } = event.user;
    console.log("Filtering function Running");
    setCurrentIndex(0);
    // setFilter(false);
    setLoading(false);
    setData([]);
    const mergedates = `${date + " " + fromTime}`;
    const mergeTotime = `${date + " " + toTime}`;
    const params = new URLSearchParams(window.location.search);
    const user = params.get("user");
    // console.log(user);
    try {
      setOffset(0);
      const response = await axios.request(
        `https://jobmanager.in/react-api.php?from_date=${mergedates}&to_date=${mergeTotime}&uid=${id}&offset=${offset}`
      );
      const jsonData = await response.data;
      const getTimeFromDatetime = (datetime) => {
        const datetimeObj = DateTime.fromFormat(
          datetime,
          "MMMM dd, yyyy hh:mm:ss a"
        );
        return datetimeObj.toFormat("HH:mm");
      };
      const fistImageTime = jsonData.first;
      const lastImageTime = jsonData.last;
      setFromTime(getTimeFromDatetime(fistImageTime));
      setToTime(getTimeFromDatetime(lastImageTime));
      // console.log(jsonData);
      if (typeof jsonData === "object") {
        const updatedArray = Object.keys(jsonData).map((key) => {
          const updatedDateTime = updatedDate(jsonData[key].date_info);
          const updatedScreenshot = updatedScreenshotValue(
            jsonData[key].screenshot
          );
          return {
            screenshot: updatedScreenshot,
            date_info: updatedDateTime,
          };
        });
        setTotalCount(jsonData.total_records);
        function updatedScreenshotValue(screenshot) {
          return screenshot;
        }
        function updatedDate(date_info) {
          return date_info;
        }

        setStartTime(getTimeFromDatetime(fistImageTime));
        setFromTime(getTimeFromDatetime(fistImageTime));
        setToTime(getTimeFromDatetime(lastImageTime));
        // console.log(fistImageTime);
        // console.log(lastImageTime);
        const galleryImages = updatedArray
          .slice(0, updatedArray.length - 3)
          .map((image) => ({
            original: image.screenshot,
            time: image.date_info,
          }));
        setData((prevData) => [...prevData, ...galleryImages]);
        // console.log(...galleryImages);
        setLoading(true);
        setOffset((p) => p + 10);
      } else if (typeof jsonData === "string") {
        setData(jsonData);
        setLoading(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    // }
  };
  const handleDateChange = (event) => {
    setDate(event.target.value);
    setFromTime("00:00");
    setToTime("23:00");
    setOffset(0);
  };
  const handleDropdown = () => {
    setDropdown(true);
  };
  const hideDropdown = () => {
    setDropdown(false);
  };
  const filteringImages = () => {
    console.log("Filtering");
    if (typeof data === "object") {
      const filteredData = data.filter((image) => {
        if (fromTime && startTime) {
          const imageTime = DateTime.fromFormat(
            image.time,
            "MMMM dd, yyyy hh:mm:ss a"
          );
          const ImageTime = imageTime.toFormat("HH:mm");
          return ImageTime >= fromTime && ImageTime <= startTime;
        }
      });
      setData(filteredData);
    } else {
      return null;
    }
  };
  const renderItem = (item) => {
    return (
      <div className="image-gallery-image">
        <img
          src={`data:image/png;base64,${item.original}`}
          alt=""
          className="image-gallery"
        />
        <div className="timestamp-overlay">{item.time}</div>
      </div>
    );
  };
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    console.log(isPlaying);
  };
  const handlePause = () => {
    setIsPlaying(true);
    setIsPaused(true);
  };
  const handlePlay = () => {
    setIsPlaying(false);
    setIsPaused(false);
  };
  // const handleFullscreenClick = () => {
  //   console.log("Clicked");
  //   alert("Clicked");
  // };
  const renderRecords = () => {
    return typeof data === "object" ? (
      <ImageGallery
        items={data}
        slideInterval={playback}
        slideDuration={playback}
        autoPlay={false}
        renderItem={renderItem}
        showIndex
        useBrowserFullscreen
        originalHeight
        showNav={isPlaying}
        // showPlayButton={false}
        onPlay={handlePlay}
        onPause={handlePause}
        // renderFullscreenButton={handleFullscreenClick}
        lazyLoad
        startIndex={currentIndex}
        onSlide={(currentIndex) => setCurrentIndex(currentIndex)}
        renderCustomControls={() => {
          return (
            <div>
              {dropdown ? (
                <ul className="dropdown_container" onMouseLeave={hideDropdown}>
                  <li onClick={() => setPlayback(300)}>2X</li>
                  <li onClick={() => setPlayback(400)}>1X</li>
                  <li onClick={() => setPlayback(600)}>0</li>
                  <li onClick={() => setPlayback(4000)}>0.1X</li>
                  <li onClick={() => setPlayback(5000)}>0.2X</li>
                </ul>
              ) : null}
              <SettingsIcon
                style={{ height: "33px", width: "33px", color: "white" }}
                className="settings_icon"
                // onClick={handleDropdown}
                onMouseEnter={handleDropdown}
              />
            </div>
          );
        }}
      />
    ) : (
      <div className="record-container">
        <h1 className="no-record">{data}</h1>
      </div>
    );
  };

  // const handleReset = () => {
  //   setFromTime("00:00");
  //   setToTime("23:00");
  //   setDate(todayDate);
  // };
  return (
    <>
      <div>
        <div className="time_container">
          <div>
            <label htmlFor="From_time">From</label>
            <input
              type="time"
              id="From_time"
              className="time_inputs"
              onChange={(e) => setFromTime(e.target.value)}
              value={fromTime}
            />
          </div>
          <div>
            <label htmlFor="To_time">To</label>
            <input
              type="time"
              id="To_time"
              className="time_inputs"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
            />
          </div>
          <div>
            <input
              className="time_inputs"
              type="date"
              value={date}
              onChange={handleDateChange}
              placeholder="Enter Date"
            />
          </div>
          <div className="select-container">
            <input
              onChange={(e) => setId(e.target.value)}
              value={id}
              className="id-input"
              placeholder="Enter ID"
            />
          </div>
          <div style={{ marginLeft: "auto" }}>
            <button
              style={{
                backgroundColor: "#F19828",
                paddingLeft: "10px",
                borderWidth: "0px",
                borderRadius: "3px",
                color: "white",
                height: "33px",
                fontWeight: "600",
                width: "70px",
                cursor: "pointer",
                fontFamily: "Open Sans, sans-serif",
              }}
              onClick={filteringData}
            >
              Filter
            </button>
            {/* <button
            style={{
              backgroundColor: "#F19828",
              paddingLeft: "10px",
              borderWidth: "0px",
              borderRadius: "3px",
              color: "white",
              height: "33px",
              fontWeight: "600",
              width: "70px",
              cursor: "pointer",
              fontFamily: "Open Sans, sans-serif",
              marginLeft: "10px",
            }}
            onClick={handleReset}
          >
            Reset
          </button> */}
          </div>
        </div>
        <div className="image_gallery_Container" style={{ marginTop: "20px" }}>
          {/* {renderRecords()} */}
          {loading ? (
            renderRecords()
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
              }}
            >
              <ClipLoader color="#F19828" size={30} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default ImageSlider;
