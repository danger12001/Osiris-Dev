import { useEffect, useState } from "react"
import { Spinner, Container, Card, CardBody, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, CardHeader, CardFooter, Progress } from "reactstrap";
import db from "../db/db";
import Database from "../types/Database";
import { Guid } from "guid-typescript";
import { FaPlus, FaRegEdit, FaTrashAlt } from "react-icons/fa";
import {signOut, getAuth} from 'firebase/auth'
import { PiSignOutFill } from "react-icons/pi";
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



    useEffect(() => {
        setLoading(true);
        console.log("Interact with firebase as an example and fetch all profiles")
        db.query({
            collection: "Profiles",
        }).then((results) => {
            console.log("results: ", results)
            setProfiles(results);
            setOriginalDataSet(results);
            setLoading(false);
        }).catch((err) => {
            console.log("ERROR", err)
            setLoading(false);
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
                                <h1 style={{color: "white"}}>Osiris</h1>
                            </Col>
                            <Col align="right">
                                <Button color="primary" size="sm" className="p-2 m-2" onClick={() => setShowAddForm(!showAddForm)}>
                                    <FaPlus className="m-2" />
                                </Button>
                                <Button color="danger" size="sm" className="p-2 m-2" onClick={() => {
                                    const auth = getAuth();
                                    signOut(auth).then(() => {
                                      // Sign-out successful.
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
                        <hr />
                        <Row>
                            <Col sm={12}>
                                <strong style={{color: "white"}}>Search via ID Number</strong><br />
                                <Input placeholder="Search via ID Number" onChange={(e) => { handleSearch(e.currentTarget.value) }} value={search} />
                            </Col> 
                            <Col sm={12}>
                                <strong style={{color: "white"}}>Search via Risk Level</strong><br />
                                <Input min="0" max="5" step="0.5" type="range" onChange={(e) => { handleRiskSearch(e.currentTarget.value) }} value={riskSearch} />
                            </Col>
                        </Row>
                        <br />
                        {
                            profiles ? <Row className="scroll">
                                <h3 style={{color: "white"}}>Profiles:</h3>
                                <hr />
                                {
                                    profiles.length > 0 ? profiles.map((profile, index) => {
                                        return (
                                            <Col key={index}  sm={4}>
                                                {renderProfileCard(profile)}
                                            </Col>
                                        )
                                    }) : <h3 style={{color: "White"}}>There are no Profiles that match the filters</h3>}
                            </Row> : null
                        }
                    </> 
            }
        </Container>
    )
}

export default Home