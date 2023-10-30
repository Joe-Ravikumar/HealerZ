import React, { useState, useEffect } from "react";
import Layout from "../../layouts/layout";
import "./inventory.css";
import SupplyModal from "./modals/SupplyModal";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomConfirmModal from "./modals/confirmationmodal/CustomConfirmModal";
import axios from "axios";
import ClearIcon from '@mui/icons-material/Clear';
import { ToastContainer, toast } from "react-toastify";


function Supply(props) {
  const [showModal, setShowModal] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [searchTerm3, setSearchTerm] = useState("");
  const [searchTerm4, setSearchTerm2] = useState("");
  const [presList, setPresList] = useState([]);
  const [filteredPresList, setFilteredPresList] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [selectedPresToDelete, setSelectedPresToDelete] = useState(null);

  const [searchDate, setSearchDate] = useState("");
  const handleChangeDate = (event) => {
    setSearchDate(event.target.value);
  };

  const handleChange3 = (event) => {
    setSearchTerm(event.target.value);
  };


  const handleChange4 = (event) => {
    setSearchTerm2(event.target.value);
  };

  const handleSearchByPresID = (event) => {
    event.preventDefault();
    const searchedDrug = presList.find((drug) => drug.Prescription_ID === searchTerm3);
    if (searchedDrug) {
      setSelectedDrug(searchedDrug);
      setShowModal(true);
      setSearchTerm("");
    } else {
      toast.error("Invalid Prescription ID");
    }
  };

  const handleSearchByPatID = (event) => {
    event.preventDefault();
    const searchedDrug = presList.find((drug) => drug.Patient_ID === searchTerm4);
    if (searchedDrug) {
      setSelectedDrug(searchedDrug);
      setShowModal(true);
      setSearchTerm2("");
    } else {
      toast.error("Invalid Patient ID");
    }
  };
  
  const handleDelete = async (prescription_list) => {
    setConfirmModalVisible(true);
    setSelectedPresToDelete(prescription_list);
  };

  const handleConfirmDelete = async () => {
    setConfirmModalVisible(false);
    const prescriptionToDelete = selectedPresToDelete;
    setSelectedPresToDelete(null);
    try {
      const response = await axios.get(
        `http://localhost/Healerz/PHP/Inventory/deletePrescription.php?id=${prescriptionToDelete.Prescription_ID}`
      );
      if (response.data.message === 'Prescription deleted successfully') {
        toast.success(response.data.message);
        fetchData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting Prescription:", error);
      toast.error("Error deleting Prescription");
    }
  };
  
  
  

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost/Healerz/PHP/Inventory/displayPrescriptions.php"
      );
      setPresList(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const filteredData = presList.filter(
      (prescription_list) =>
        prescription_list.Prescription_ID.includes(searchTerm3) &&
        prescription_list.Patient_ID.includes(searchTerm4) &&
        (searchDate === "" || prescription_list.TimeP.includes(searchDate))
    );
    setFilteredPresList(filteredData);
  }, [searchTerm3, searchTerm4, searchDate, presList]);


  const openModal = (drug) => {
    setSelectedDrug(drug);
    setShowModal(true);
  };

  useEffect(() => {
    fetchData();
  }, [updateTrigger]);

  return (
    <Layout>
      {/* <h3 className="serhedd">Supply Detail</h3> */}
      <div className={"container tabconttt"}>
        <div className={"p-5"}>
          <hr />
          <div
            className={"SearchSection"}
            style={{ display: "flex", flexDirection: "row" }}
          >
            <div className={"SearchSection2"}>
              <div className="search-input-container">
                <form onSubmit={handleSearchByPresID}>
                  <input
                    className="SearchBox1"
                    type="text"
                    placeholder="Filter by Prescription_ID"
                    value={searchTerm3}
                    onChange={handleChange3}
                    style={{ width: "300px" }}
                  />
                  <div className="search-icon" onClick={handleSearchByPresID}>
                    <SearchIcon />
                  </div>
                  {searchTerm3 && (
                  <div className="search-icon" style={{zIndex:'100',backgroundColor:'white',right:'6px'}} onClick={() => setSearchTerm("")}>
                   <ClearIcon/>
                  </div>
                )}
                </form>
              </div>
              <div className="search-input-container">
                <form onSubmit={handleSearchByPatID}>
                  <input
                    className="SearchBox1"
                    type="text"
                    placeholder="Filter by Patient_ID"
                    value={searchTerm4}
                    onChange={handleChange4}
                    style={{ width: "300px" }}
                  />
                  <div className="search-icon" onClick={handleSearchByPatID}>
                    <SearchIcon />
                  </div>
                  {searchTerm4 && (
                  <div className="search-icon" style={{zIndex:'100',backgroundColor:'white',right:'6px'}} onClick={() => setSearchTerm2("")}>
                   <ClearIcon/>
                  </div>
                )}
                </form>
              </div>

              <div className="search-input-container">
                <input
                  className="SearchBox1"
                  type="date"
                  placeholder="Filter by Date"
                  value={searchDate}
                  onChange={handleChangeDate}
                  style={{ width: "300px" }}
                />
                {searchDate && (
                  <div className="search-icon" style={{zIndex:'100',backgroundColor:'white',right:'4px'}} onClick={() => setSearchDate("")}>
                   <ClearIcon/>
                  </div>
                )}
              </div>
            </div>
          </div>
          <hr />
          <div className="table-container tablesupply">
            <table className={"table table-hover table-striped "}>
              <thead className="top-0 position-sticky h-45">
                <tr>
                  <th scope="col" className="center-headingtable">NO</th>
                  <th scope="col" className="center-headingtable">DATE</th>
                  <th scope="col" className="center-headingtable">PRESCRIPTION_ID</th>
                  <th scope="col" className="center-headingtable">PATIENT_ID</th>
                  <th scope="col" className="center-headingtable">PATIENT_NAME</th>
                  <th scope="col" className="center-headingtable">STATUS</th>
                  <th scope="col" className="center-headingtable">ACTION</th>
                </tr>
              </thead>
              <tbody className="h-50">
                {filteredPresList.length > 0 ? (
                  filteredPresList.map((data, index) => (
                    <tr key={index}>
                      <th className="center-celltable" scope="row">{index + 1}</th>
                      <td className="center-celltable">{data.TimeP}</td>
                      <td className="center-celltable">{data.Prescription_ID}</td>
                      <td className="center-celltable">{data.Patient_ID}</td>
                      <td className="center-celltable">{data.PatientName}</td>
                      <td
                        style={{textAlign:'center'}}
                        className={
                          data.status === "Waiting"
                            ? "waiting"
                            : data.status === "Delivered"
                            ? "delivered"
                            : "rejected"
                        }
                      >
                        {data.status}
                      </td>
                      <td className="center-celltable">
                        <IconButton
                          aria-label="delete"
                          className="viewbutt"
                          onClick={() => openModal(data)}
                          style={{ color: "green" }}
                        >
                          <BrowserUpdatedIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          className="viewbutt"
                          onClick={() => handleDelete(data)}
                          style={{ color: "red" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No results found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <ToastContainer />
      </div>
      <SupplyModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setUpdateTrigger(!updateTrigger);
        }}
        drugDetails={selectedDrug}
      />
      <CustomConfirmModal
        show={confirmModalVisible}
        onHide={() => setConfirmModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </Layout>
  );
}

export default Supply;
