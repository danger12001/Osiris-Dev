import { useEffect, useState } from "react"
import { Spinner, Container, Card, CardBody, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, CardHeader, CardFooter, Progress } from "reactstrap";
import db from "../db/db";
import Database from "../types/Database";
import { Guid } from "guid-typescript";
import { FaPlus, FaRegEdit, FaTrashAlt, FaRegListAlt } from "react-icons/fa";
import { signOut, getAuth } from 'firebase/auth'
import { PiSignOutFill } from "react-icons/pi";
import { MdOutlineReportProblem } from "react-icons/md";

interface Profile {
    FirstName: string,
    LastName: string,
    IdNumber: string,
    RiskLevel: 0 | 1 | 2 | 3 | 4 | 5
}

const Home = () => {
    const [profiles, setProfiles] = useState([]);
    const [originalDataSet, setOriginalDataSet] = useState([]);

    const [loading, setLoading] = useState(false);
    const [newProfile, setNewProfile] = useState<Profile>({ FirstName: "", LastName: "", IdNumber: "", RiskLevel: 0 });
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [existingProfile, setExistingProfile] = useState<any>({ FirstName: "", LastName: "", IdNumber: "", id: "", RiskLevel: 0 });
    const [search, setSearch] = useState("");
    const [riskSearch, setRiskSearch] = useState(5);

    const [showIncidentForm, setShowIncidentForm] = useState(false);
    const [incidentDate, setIncidentDate] = useState(new Date());
    const [incidentDescription, setIncidentDescription] = useState("");
    const [incidentId, setIncidentId] = useState("");
    const [showIncidents, setShowIncidents] = useState(false);
    const [incidents, setIncidents] = useState([]);
    const [OriginalIncidents, setOriginalIncidents] = useState([]);
    const [incidentSearch, setIncidentSearch] = useState("");






    useEffect(() => {
        setLoading(true);
        db.query({
            collection: "Profiles",
        }).then((results) => {
            setProfiles(results);
            setOriginalDataSet(results);
            setLoading(false);
        }).catch((err) => {
            console.log("ERROR", err)
            setLoading(false);
        })

        db.query({
            collection: "Incidents",
        }).then((results) => {
            setIncidents(results);
            setOriginalIncidents(results);
        })
    }, []);

    const updateNewProfile = (event: any, field: string) => {
        const profile = { ...newProfile };
        switch (field) {
            case "FirstName":
                profile.FirstName = event.currentTarget.value;
                break;
            case "LastName":
                profile.LastName = event.currentTarget.value;
                break;
            case "IdNumber":
                profile.IdNumber = event.currentTarget.value;
                break;
            case "RiskLevel":
                profile.RiskLevel = event.currentTarget.value;
                break;
        }
        setNewProfile(profile);
    }

    const updateExistingProfile = (event: any, field: string) => {
        const profile = { ...existingProfile };
        switch (field) {
            case "FirstName":
                profile.FirstName = event.currentTarget.value;
                break;
            case "LastName":
                profile.LastName = event.currentTarget.value;
                break;
            case "IdNumber":
                profile.IdNumber = event.currentTarget.value;
                break;
            case "RiskLevel":
                profile.RiskLevel = event.currentTarget.value;
                break;
        }
        setExistingProfile(profile);
    }

    const resetNewProfile = () => {
        const profile = { ...newProfile };
        profile.FirstName = "";
        profile.LastName = "";
        profile.IdNumber = "";
        setNewProfile(profile);
    }

    const addProfile = () => {

        const profile: Database.Profiles = {
            ...newProfile,
            id: Guid.create().toString()
        }

        if (profile.IdNumber === "" || profile.IdNumber.includes("?")) {
            profile.RiskLevel = 5;
            profile.IdNumber = "?";
        }

        db.addItem("Profiles", profile).then(() => {
            resetNewProfile();
            setShowAddForm(false);
            window.location.reload();
        });
    };

    const editProfile = () => {
        if (existingProfile.IdNumber === "" || existingProfile.IdNumber.includes("?")) {
            existingProfile.RiskLevel = 5;
            existingProfile.IdNumber = "?";
        }


        db.updateItem("Profiles", existingProfile.id, existingProfile).then(() => {
            toggleEdit();
            window.location.reload();
        });
    };

    const addIncident = () => {

        const Incident: Database.Incidents = {
            IncidentDate: new Date(incidentDate),
            IncidentDescription: incidentDescription,
            IdNumber: incidentId,
            id: Guid.create().toString()
        };

        db.addItem("Incidents", Incident).then(() => {
            setIncidentDate(new Date());
            setIncidentDescription("");
            setIncidentId("");
            setShowIncidentForm(false);
        });
    };

    const deleteProfile = (profile: any) => {
        db.deleteItem("Profiles", profile.id).then(() => {
            window.location.reload();
        });
    };

    const toggleEdit = (profile?: Profile) => {
        setShowEditForm(!showEditForm);
        if (profile) {
            setExistingProfile(profile);
        } else {
            setExistingProfile({ FirstName: "", LastName: "", IdNumber: "", RiskLevel: 0 });
        }
    }



    const renderEditForm = () => {
        return (
            <Modal isOpen={showEditForm} toggle={() => { toggleEdit() }}>
                <ModalHeader toggle={() => { toggleEdit() }}>Edit Profile</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col className="mb-2" sm={12}>
                            <strong>First Name</strong><br />
                            <Input type="text" value={existingProfile.FirstName} onChange={(event) => updateExistingProfile(event, "FirstName")} />
                        </Col>
                        <Col className="mb-2" sm={12}>
                            <strong>Last Name</strong><br />
                            <Input type="text" value={existingProfile.LastName} onChange={(event) => updateExistingProfile(event, "LastName")} />
                        </Col>
                        <Col className="mb-2" sm={12}>
                            <strong>ID Number</strong><br />
                            <Input type="text" value={existingProfile.IdNumber} onChange={(event) => updateExistingProfile(event, "IdNumber")} />
                        </Col>
                        <Col className="mb-2" sm={12}>
                            <strong>Risk Level</strong><br />
                            <Input type="range" value={existingProfile.RiskLevel} onChange={(event) => updateExistingProfile(event, "RiskLevel")} step={0.5} min={0} max={5} />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={editProfile}>
                        Edit Profile
                    </Button>{' '}
                    <Button color="secondary" onClick={() => { toggleEdit() }}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        )
    }

    const renderIncidentForm = () => {

        return (
            <Modal isOpen={showIncidentForm} toggle={() => { setShowIncidentForm(false); setIncidentDate(new Date()); setIncidentDescription(""); setIncidentId("") }}>
                <ModalHeader toggle={() => { setShowIncidentForm(false); setIncidentDate(new Date()); setIncidentDescription(""); setIncidentId("") }}>Add Incident</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col className="mb-2" sm={12}>
                            <strong>Incident Date</strong><br />
                            <Input type="date" value={`${new Date(incidentDate).getFullYear()}-${new Date(incidentDate).getMonth() < 10 ? "0" + new Date(incidentDate).getMonth() : new Date(incidentDate).getMonth()}-${new Date(incidentDate).getDate() < 10 ? "0" + new Date(incidentDate).getDate() : new Date(incidentDate).getDate()}`} onChange={(event) => setIncidentDate(new Date(event.currentTarget.value))} />
                        </Col>
                        <Col className="mb-2" sm={12}>
                            <strong>Incident Description</strong><br />
                            <Input type="textarea" value={incidentDescription} onChange={(event) => setIncidentDescription(event.currentTarget.value)} />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={addIncident}>
                        Add Incident
                    </Button>{' '}
                    <Button color="secondary" onClick={() => { setShowIncidentForm(false); setIncidentDate(new Date()); setIncidentDescription(""); setIncidentId("") }}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        )
    }

    const handleSearch = (searchTerm: string) => {
        setSearch(searchTerm);
        if (searchTerm == "") {
            setProfiles(originalDataSet);
        } else {

            const filtered = originalDataSet.filter((profile) => {
                return profile.IdNumber.includes(searchTerm);
            });

            setProfiles(filtered);
        }

    }

    const handleIncidentSearch = (searchTerm: string) => {
        setIncidentSearch(searchTerm);
        if (searchTerm == "") {
            setIncidents(OriginalIncidents);
        } else {

            const filtered = OriginalIncidents.filter((incident) => {
                return incident.IdNumber.includes(searchTerm);
            });

            setIncidents(filtered);
        }

    }

    const handleRiskSearch = (searchTerm: number) => {

        setRiskSearch(searchTerm);

        const filtered = originalDataSet.filter((profile) => {
            return profile.RiskLevel <= searchTerm;
        });

        setProfiles(filtered);


    }

    const renderAddForm = () => {
        return (
            <Modal isOpen={showAddForm} toggle={() => { setShowAddForm(!showAddForm); resetNewProfile() }}>
                <ModalHeader toggle={() => { setShowAddForm(!showAddForm); resetNewProfile() }}>Add New Profile</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col className="mb-2" sm={12}>
                            <strong>First Name</strong><br />
                            <Input type="text" value={newProfile.FirstName} onChange={(event) => updateNewProfile(event, "FirstName")} />
                        </Col>
                        <Col className="mb-2" sm={12}>
                            <strong>Last Name</strong><br />
                            <Input type="text" value={newProfile.LastName} onChange={(event) => updateNewProfile(event, "LastName")} />
                        </Col>
                        <Col className="mb-2" sm={12}>
                            <strong>ID Number</strong><br />
                            <Input type="text" value={newProfile.IdNumber} onChange={(event) => updateNewProfile(event, "IdNumber")} />
                        </Col>
                        <Col className="mb-2" sm={12}>
                            <strong>Risk Level</strong><br />
                            <Input type="range" value={newProfile.RiskLevel} onChange={(event) => updateNewProfile(event, "RiskLevel")} step={0.5} min={0} max={5} />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={addProfile}>
                        Add Profile
                    </Button>{' '}
                    <Button color="secondary" onClick={() => { setShowAddForm(!showAddForm); resetNewProfile() }}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        )
    }

    const renderIncidents = () => {

        return showIncidents ? (
            <Card className="p-4">
                <CardHeader>
                    <Row>
                        <Col >
                            <h2>Incidents</h2>
                        </Col>
                        <Col align="right">
                            <Button onClick={() => { setShowIncidents(!showIncidents) }} color="danger">X</Button>
                        </Col>
                    </Row>

                </CardHeader>
                <CardBody>
                    <Row>
                        <Col sm={12}>
                            <strong style={{ color: "white" }}>Search via ID Number</strong><br />
                            <Input placeholder="Search via ID Number" onChange={(e) => { handleIncidentSearch(e.currentTarget.value) }} value={incidentSearch} />
                        </Col>
                    </Row>
                    <br />
                    <Row className="p-2">
                        <Col sm={3}><strong>Incident Date</strong></Col>
                        <Col sm={3}><strong>Id Number</strong></Col>
                        <Col sm={6}><strong>Incident Description</strong></Col>
                    </Row>

                    {
                        incidents.sort((a: any, b: any) => {
                            const dateA = new Date(1970, 0, 1); // Epoch
                            const dateB = new Date(1970, 0, 1); // Epoch
                            dateA.setSeconds(a.IncidentDate.seconds);
                            dateB.setSeconds(b.IncidentDate.seconds);
                            console.log(a.IncidentDate.seconds, b.IncidentDate.seconds)
                            return a.IncidentDate.seconds < b.IncidentDate.seconds ? 1 : -1;
                        }).map((incident) => {
                            var t = new Date(1970, 0, 1); // Epoch
                            t.setSeconds(incident.IncidentDate.seconds);
                            const date = t.toLocaleDateString();
                            return (
                                <Row className="p-2">
                                    <Col sm={3}>
                                        {date}
                                    </Col>
                                    <Col sm={3}>
                                        {incident.IdNumber}
                                    </Col>
                                    <Col sm={6}>
                                        {incident.IncidentDescription}
                                    </Col>
                                </Row>
                            )
                        })
                    }


                </CardBody>
            </Card>
        ) : null
    }

    const renderProfileCard = (profile) => {
        const riskPercentage = (profile.RiskLevel * 10) * 2;
        return (
            <Card className="p-4 m-2">
                <CardHeader>
                    <Row>
                        <Col sm={12}>
                            <h4>{profile.FirstName} {profile.LastName}</h4>
                        </Col>

                    </Row>
                </CardHeader>

                <CardBody>
                    <Row>
                        <Col sm={12} md={6}>
                            <strong>ID Number: </strong><br />
                            {profile.IdNumber}
                        </Col>
                        <Col sm={12} md={6}>
                            <strong>Risk Level: </strong><br />
                            <Progress
                                color={riskPercentage < 50 ? "success" : riskPercentage <= 75 ? "warning" : "danger"}
                                value={riskPercentage}
                            />
                        </Col>
                    </Row>
                </CardBody>
                <CardFooter align="right">
                    {
                        profile.IdNumber !== "?" ?
                            <Button color="primary" className="p-2 m-2" onClick={() => { setShowIncidentForm(true); setIncidentId(profile.IdNumber) }}>
                                <MdOutlineReportProblem className="m-2" />
                            </Button> : null

                    }
                    <Button color="primary" className="p-2 m-2" onClick={() => toggleEdit(profile)}>
                        <FaRegEdit className="m-2" />
                    </Button>
                    <Button color="danger" className="p-2 m-2" onClick={() => deleteProfile(profile)}>
                        <FaTrashAlt className="m-2" />
                    </Button>
                </CardFooter>
            </Card>
        )
    }


    return (
        <Container className="p-4" fluid={true}>

            {
                loading ? <Spinner /> :
                    <>
                        <Row>
                            <Col className="p-2">
                                <h1 style={{ color: "white" }}>Osiris</h1>
                            </Col>
                            <Col align="right">
                                <Button color="primary" size="sm" className="p-2 m-2" onClick={() => setShowIncidents(!showIncidents)}>
                                    <FaRegListAlt className="m-2" />
                                </Button>
                                <Button color="primary" size="sm" className="p-2 m-2" onClick={() => setShowAddForm(!showAddForm)}>
                                    <FaPlus className="m-2" />
                                </Button>
                                <Button color="danger" size="sm" className="p-2 m-2" onClick={() => {
                                    const auth = getAuth();
                                    signOut(auth).then(() => {
                                        // Sign-out successful.
                                        sessionStorage.removeItem("user");
                                        window.location.reload();
                                    }).catch((error) => {
                                        // An error happened.
                                    });
                                }}>
                                    <PiSignOutFill className="m-2" />
                                </Button>
                            </Col>

                        </Row>


                        {
                            renderAddForm()
                        }
                        {
                            renderEditForm()
                        }
                        {
                            renderIncidentForm()
                        }
                        {
                            renderIncidents()
                        }
                        <hr />
                        <Row>
                            <Col sm={12}>
                                <strong style={{ color: "white" }}>Search via ID Number</strong><br />
                                <Input placeholder="Search via ID Number" onChange={(e) => { handleSearch(e.currentTarget.value) }} value={search} />
                            </Col>
                            <Col sm={12}>
                                <strong style={{ color: "white" }}>Search via Risk Level</strong><br />
                                <Input min="0" max="5" step="0.5" type="range" onChange={(e) => { handleRiskSearch(Number(e.currentTarget.value)) }} value={riskSearch} />
                            </Col>
                        </Row>
                        <br />
                        {
                            profiles ? <Row className="scroll">
                                <h3 style={{ color: "white" }}>Profiles:</h3>
                                <hr />
                                {
                                    profiles.length > 0 ? profiles.map((profile, index) => {
                                        return (
                                            <Col key={index} sm={4}>
                                                {renderProfileCard(profile)}
                                            </Col>
                                        )
                                    }) : <h3 style={{ color: "White" }}>There are no Profiles that match the filters</h3>}
                            </Row> : null
                        }
                    </>
            }
        </Container>
    )
}

export default Home