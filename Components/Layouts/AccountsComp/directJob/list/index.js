import { DeleteOutlined, DollarOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Pagination } from "antd";
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from 'next/router';
import moment from "moment";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { resetDirectJob } from "../../../../../redux/directJob/directJobSlice";

const commas = (a) => a == 0 ? '0' : parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

const DirectJobList = ({ voucherData }) => {

    const dispatch = useDispatch();

    const [ search, setSearch ] = useState("");

    const allRecords = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15"]; // example data
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // records per page

    // 1️⃣ Filter records based on search (partial match)
    const filteredRecords = allRecords.filter(record =>
    record.toLowerCase().includes(search.toLowerCase())
    );

    // compute visible records for current page
    const indexOfLast = currentPage * pageSize;
    const indexOfFirst = indexOfLast - pageSize;
    const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);


    return (
        <div className='base-page-layout'>
            <Row style={{ width: '100%', justifyContent: 'space-between', alignItems: 'end', borderBottom: '2px solid black', paddingBottom: '10px'}}>
                <Col md={12}>
                    <h2 style={{margin: '0', padding: '0'}}>Direct Job Expense / Revenue</h2>
                </Col>
                <Col md={6}>
                    {/* Pagination controls here */}
                    <Pagination 
                        current={currentPage} 
                        pageSize={pageSize} 
                        total={allRecords.length} 
                        onChange={(page) => setCurrentPage(page)} 
                        size="small"
                        showSizeChanger={false}
                    />
                </Col>
                <Col md={5} style={{ position: 'relative' }}>
                    <Input
                    placeholder="Search..."
                    style={{
                        borderRadius: '25px',
                        width: '100%',
                        padding: '5px 30% 5px 15px'
                    }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    ></Input>
                    <Button
                        style={{
                            position: 'absolute',
                            right: '0',
                            top: '0%',
                            // transform: 'translateY(-50%)',

                            width: '35px',     // equal width & height → circle
                            height: '35px',
                            padding: 0,

                            backgroundColor: '#1f2937',
                            color: 'white',
                            borderRadius: '50%',

                            display: 'flex',            // center icon
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                        }}
                        >
                        <SearchOutlined style={{ color: 'white', fontSize: '20px' }} />
                        </Button>
                </Col>
                <Col md={1} style={{ position: 'relative', justifyContent: 'flex-end', display: 'flex' }}>
                    <Button
                        onClick={async () => {
                            dispatch(incrementTab({ "label": "Direct Job E / R", "key": "3-15", "id": "new" }))
                            dispatch(resetDirectJob())
                            await Router.push(`/accounts/directJob/new`)
                        }}
                        style={{
                            width: '35px',     // equal width & height → circle
                            height: '35px',
                            padding: 0,
                            backgroundColor: '#1f2937',
                            color: 'white',
                            borderRadius: '50%',
                            display: 'flex',            // center icon
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                        }}
                        >
                            <PlusOutlined style={{ color: 'white', fontSize: '20px' }} />
                    </Button>
                </Col>
            </Row>
            {currentRecords.map((item, index) => (
                <Row className="voucher-box">
                    <Row className="d-flex w-100" style={{ height: '40%'}}>
                        <Col md={5}>
                            <Row>
                                <span style={{ color: 'grey', fontSize: '14px' }}>Entry #</span>
                            </Row>
                            <Row>
                                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937'}}>{item}</span>
                            </Row>
                        </Col>
                        <Col md={4}>
                            <Row>
                                <span style={{ color: 'grey', fontSize: '14px' }}>Job #</span>
                            </Row>
                            <Row>
                                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937'}}>DJ-0001</span>
                            </Row>
                        </Col>
                        <Col md={4}>
                            <Row>
                                <span style={{ color: 'grey', fontSize: '14px' }}>Account #</span>
                            </Row>
                            <Row>
                                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937'}}>DJ-0001</span>
                            </Row>
                        </Col>
                        <Col md={3}>
                            <Row>
                                <span style={{ color: 'grey', fontSize: '14px' }}>Cost Center</span>
                            </Row>
                            <Row>
                                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937'}}>DJ-0001</span>
                            </Row>
                        </Col>
                        <Col md={3}>
                            <Row>
                                <span style={{ color: 'grey', fontSize: '14px' }}>Currency</span>
                            </Row>
                            <Row>
                                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937'}}>DJ-0001</span>
                            </Row>
                        </Col>
                        <Col md={4}>
                            <Row>
                                <span style={{ color: 'grey', fontSize: '14px' }}>Reference #</span>
                            </Row>
                            <Row>
                                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937'}}>DJ-0001</span>
                            </Row>
                        </Col>
                        <Col md={1} style={{ justifyContent: 'center', display: 'flex', alignItems: 'end' }}>
                            <Button
                                onClick={async () => {
                                    dispatch(incrementTab({ "label": "Edit Direct Job E / R", "key": "3-15", "id": item }))
                                    await Router.push(`/accounts/directJob/${item}`)
                                }}
                                className="edit-btn"
                                >
                                    <EditOutlined className="edit-icon" style={{ color: '#1f2937', fontSize: '20px' }} />
                            </Button>
                        </Col>
                    </Row>
                    <Row style={{ width: '100%', height: '20%', margin: '0'}}>
                        <span style={{ marginRight: '10px', padding: '0px 10px', backgroundColor: '#16A34A', color: 'white', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold', justifyContent: 'center', display: 'flex', alignItems: 'center'}}>Active</span>
                        <span style={{ marginRight: '10px', padding: '0px 10px', backgroundColor: '#1D4ED8', color: 'white', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold', justifyContent: 'center', display: 'flex', alignItems: 'center'}}>Bank</span>
                        <span style={{ marginRight: '10px', padding: '0px 10px', backgroundColor: '#0EA5E9', color: 'white', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold', justifyContent: 'center', display: 'flex', alignItems: 'center'}}>Cash</span>
                        <span style={{ marginRight: '10px', padding: '0px 10px', backgroundColor: '#F59E0B', color: 'white', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold', justifyContent: 'center', display: 'flex', alignItems: 'center'}}>Adjustment</span>
                        <span style={{ marginRight: '10px', padding: '0px 10px', backgroundColor: '#6D28D9', color: 'white', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold', justifyContent: 'center', display: 'flex', alignItems: 'center'}}>Single</span>
                        <span style={{ marginRight: '10px', padding: '0px 10px', backgroundColor: '#9333EA', color: 'white', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold', justifyContent: 'center', display: 'flex', alignItems: 'center'}}>Multiple</span>
                        <span style={{ marginRight: '10px', padding: '0px 10px', backgroundColor: '#059669', color: 'white', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold', justifyContent: 'center', display: 'flex', alignItems: 'center'}}>Revenue</span>
                        <span style={{ marginRight: '10px', padding: '0px 10px', backgroundColor: '#DC2626', color: 'white', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold', justifyContent: 'center', display: 'flex', alignItems: 'center'}}>Expense</span>
                    </Row>
                    <Row className="d-flex w-100" style={{ height: '40%', marginTop: '5px'}}>
                        <Col md={5}>
                            <Row>
                                <span style={{ color: 'grey', fontSize: '14px' }}>Entry Date</span>
                            </Row>
                            <Row>
                                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937'}}>{moment().format("DD-MMM-YYYY")}</span>
                            </Row>
                        </Col>
                        <Col md={4}>
                            <Row>
                                <span style={{ color: 'grey', fontSize: '14px' }}>Job Type</span>
                            </Row>
                            <Row>
                                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937'}}>DJ-0001</span>
                            </Row>
                        </Col>
                        <Col md={4}>
                            <Row>
                                <span style={{ color: 'grey', fontSize: '14px' }}>Cheque #</span>
                            </Row>
                            <Row>
                                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937'}}>DJ-0001</span>
                            </Row>
                        </Col>
                        <Col md={3}>
                            <Row>
                                <span style={{ color: 'grey', fontSize: '14px' }}>Cheq Date</span>
                            </Row>
                            <Row>
                                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937'}}>{moment().format("DD-MMM-YYYY")}</span>
                            </Row>
                        </Col>
                        <Col md={3}>
                            <Row>
                                <span style={{ color: 'grey', fontSize: '14px' }}>Amount</span>
                            </Row>
                            <Row>
                                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937'}}>{commas(100000)}</span>
                            </Row>
                        </Col>
                        <Col md={4}>
                            <Row>
                                <span style={{ color: 'grey', fontSize: '14px' }}>Voucher #</span>
                            </Row>
                            <Row>
                                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937'}}>SNS-DE-0001/26</span>
                            </Row>
                        </Col>
                        <Col md={1} style={{ justifyContent: 'center', display: 'flex', alignItems: 'start' }}>
                            <Button
                                className="delete-btn"
                                >
                                    <DeleteOutlined className="delete-icon" style={{ color: '#1f2937', fontSize: '20px' }} />
                            </Button>
                        </Col>
                    </Row>
                </Row>
            ))}
        </div>
    );
};

export default DirectJobList