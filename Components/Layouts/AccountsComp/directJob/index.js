import { DeleteOutlined, DollarOutlined, EditOutlined, PlusOutlined, SaveOutlined, SearchOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Pagination, InputNumber, Select, DatePicker, Checkbox, Modal } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { setDJField, resetDirectJob, updateDirectJobItem } from '/redux/directJob/directJobSlice';
import { useDispatch, useSelector } from "react-redux";
import openNotification from '/Components/Shared/Notification';
import axios from "axios";

const commas = (a) => a == 0 ? '0.00' : parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

const DirectJob = ({ id }) => {
    const [ show, setShow ] = useState(false);
    const [ selector, setSelector ] = useState({
        type: "",
        index: 0
    });
    const dispatch = useDispatch();
    const state = useSelector((state) => state.directJob);

    const [ search, setSearch ] = useState("");
    
    // const allRecords = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15"]; // example data
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // records per page

    // 1️⃣ Filter records based on search (partial match)
    const filteredRecords = state.directJob_Jobs.filter(record => {
        const q = search.toLowerCase();

        return (
            record?.jobNo?.toLowerCase().includes(q) ||
            record?.Client?.name?.toLowerCase().includes(q) ||
            record?.consignee?.name?.toLowerCase().includes(q) ||
            record?.Bl?.hbl?.toLowerCase().includes(q) ||
            record?.Bl?.mbl?.toLowerCase().includes(q)
        );
    });


    // compute visible records for current page
    const indexOfLast = currentPage * pageSize;
    const indexOfFirst = indexOfLast - pageSize;
    const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);

    useEffect(() => {
        const fetchreceivingAccount = async () => {
        //   dispatch(setField({ field: 'load', value: true }))
          try{
            await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ACCOUNT_FOR_TRANSACTION, {
              headers: {
                type: state.directJob_TransMode,
                // companyid: companyId,
              }
            }).then((x) => {
              console.log(x.data.result)
              dispatch(setDJField({ field: 'directJob_SettlementAccounts', value: x.data.result }))
            //   dispatch(setField({ field: 'load', value: false }))
            })
          }catch(e){
            console.log(e)
          }
        }
        fetchreceivingAccount()
      }, [state.directJob_TransMode])

      useEffect(() => {
            const getAccounts = async () => {
                try {
                    const res = await axios.get(
                        process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CHILD_ACCOUNTS
                    );
                    const accounts = res?.data?.result || [];
                    // only update if data exists
                    if (accounts.length > 0) {
                        dispatch(setDJField({
                        field: 'directJob_CAccounts',
                        value: accounts
                        }));
                    }
                    const result = await axios.get(
                        process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CHARGES
                    );
                    const charges = result?.data?.result || [];
                    // only update if data exists
                    if (accounts.length > 0) {
                        dispatch(setDJField({
                        field: 'directJob_Charges',
                        value: charges
                        }));
                    }
                    const jobs = await axios.get(
                        process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL + '/seaJob/getJobNumbers'
                    );
                    const job = jobs?.data?.result || [];
                    // only update if data exists
                    if (accounts.length > 0) {
                        dispatch(setDJField({
                        field: 'directJob_Jobs',
                        value: job
                        }));
                    }
                } catch (e) {
                    console.error("Failed to fetch", e);
                }
            };

            getAccounts();
        }, []); // ✅ runs once

    console.log("Direct Job State", state)
    return (
        <div className='base-page-layout'>
            <Row style={{ width: '100%', justifyContent: 'space-between', alignItems: 'end', borderBottom: '2px solid black', paddingBottom: '10px'}}>
                <Col md={10}>
                    <h4 style={{margin: '0', padding: '0'}}>{id == 'new' ? 'Add ' : 'Edit '}Direct Job Expense / Revenue</h4>
                </Col>
                <Col md={5}></Col>
                <Col md={6}>
                    <Row style={{alignItems: 'end'}}>
                        <h5 style={{margin: '0', padding: '0'}}>Voucher #</h5>
                        <h6 style={{margin: '0', padding: '0', marginLeft: '10px'}}> {' ' + state.directJob_VoucherNumber}</h6>
                    </Row>
                </Col>
                <Col md={1} style={{textAlign: 'right'}}>
                    {id != 'new' && <Button
                        className="delete-btn1"
                    >
                        <DeleteOutlined className="delete-icon" style={{ color: '#1f2937', fontSize: '20px' }} />
                    </Button>}
                </Col>
                <Col md={1} style={{textAlign: 'right'}}>
                    <Button
                        className="edit-btn1"
                        onClick={() => {
                            // console.log("Reset Direct Job State")
                            // dispatch(resetDirectJob())
                            // dispatch(setDJField({ field: 'directJob_Id', value: 'new' }))
                            // setShow(true)
                        }}
                    >
                        <SaveOutlined className="edit-icon" style={{ color: '#1f2937', fontSize: '20px' }} />
                    </Button>
                </Col>
                <Col md={1} style={{textAlign: 'right'}}>
                    <Button
                        className="delete-btn1"
                        onClick={() => {
                            // console.log("Reset Direct Job State")
                            // dispatch(resetDirectJob())
                            // dispatch(setDJField({ field: 'directJob_Id', value: 'new' }))
                            setShow(true)
                        }}
                    >
                        <WarningOutlined className="delete-icon" style={{ color: '#1f2937', fontSize: '20px' }} />
                    </Button>
                </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '20px' }}>
                <Col md={4}>
                    <label className="custom-label">Entry #</label>
                    <div style={{
                        width: '90%',
                        height: '30px',
                        border: '1px solid #d7d7d7',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'start',
                        padding: '15px 10px'
                    }}>{state.directJob_EntryNumber}</div>
                    <label className="custom-label">Job #</label>
                    <div style={{
                        width: '90%',
                        height: '30px',
                        border: '1px solid #d7d7d7',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'start',
                        padding: '15px 10px'
                    }}
                    onClick={() => {
                        setShow(true)
                        setSelector({type: 'single', index: 0})
                    }}
                    >{state.directJob_JobNumber}</div>
                    <label className="custom-label">File #</label>
                    <Input style={{width: '90%'}} placeholder="File #" value={state.directJob_FileNumber} onChange={(e) => {dispatch(setDJField({ field: 'directJob_FileNumber', value: e.target.value}))}}/>
                </Col>
                <Col md={4}>
                    <label className="custom-label">Entry Date*</label>    
                    <DatePicker format={'DD-MM-YYYY'} style={{width: '90%'}} value={state.directJob_EntryDate} onChange={(e) => {dispatch(setDJField({ field: 'directJob_EntryDate', value: e}))}}/>
                    <label className="custom-label">Tran Mode*</label>
                    <Select style={{width: '90%'}} placeholder="Tran Mode" value={state.directJob_TransMode} onChange={(e) => {dispatch(setDJField({ field: 'directJob_TransMode', value: e}))}}>
                        <Select.Option value="Bank">Bank</Select.Option>
                        <Select.Option value="Cash">Cash</Select.Option>
                        <Select.Option value="Adjust">Adjustment</Select.Option>
                    </Select>
                    <label className="custom-label">Ex-Rate</label>
                    <InputNumber disabled={state.directJob_Currency == 'PKR'} style={{width: '90%'}} placeholder="Ex-Rate..." value={state.directJob_ExRate} onChange={(e) => {dispatch(setDJField({ field: 'directJob_ExRate', value: e}))}}/>
                </Col>
                <Col md={8}>
                    <Row>
                        <Col md={12}>
                            <label className="custom-label">Type*</label>
                            <Select style={{width: '90%'}} placeholder="Entry #" value={state.directJob_Type} onChange={(e) => {dispatch(setDJField({ field: 'directJob_Type', value: e}))}}>
                                <Select.Option value="revenue">Revenue</Select.Option>
                                <Select.Option value="expense">Expense</Select.Option>
                            </Select>
                            <label className="custom-label">SubType*</label>
                            <Select style={{width: '90%'}} placeholder="Entry #" value={state.directJob_SubType} onChange={(e) => {dispatch(setDJField({ field: 'directJob_SubType', value: e}))}}>
                                <Select.Option value="wire transfer">Wire Transfer</Select.Option>
                                <Select.Option value="online transfer">Online Transfer</Select.Option>
                                <Select.Option value="credit card">Credit Card</Select.Option>
                                <Select.Option value="cheque">Cheque</Select.Option>
                                <Select.Option value="po">PO</Select.Option>
                                <Select.Option value="tt">TT</Select.Option>
                                <Select.Option value="cash">Cash</Select.Option>
                            </Select>
                        </Col>
                        <Col md={12}>
                            <label className="custom-label">Reference #</label>
                            <Input style={{width: '90%'}} placeholder="Reference #" value={state.directJob_Reference} onChange={(e) => {dispatch(setDJField({ field: 'directJob_Reference', value: e.target.value}))}}/>
                            <label className="custom-label">Cheque #</label>
                            <Input style={{width: '90%'}} placeholder="Cheque #" value={state.directJob_ChequeNo} onChange={(e) => {dispatch(setDJField({ field: 'directJob_ChequeNo', value: e.target.value}))}}/>
                        </Col>
                    </Row>
                    <Col md={24} style={{padding: '0'}}>
                            <label className="custom-label">Account #</label>
                            <Select
                                showSearch
                                optionFilterProp="children"
                                style={{ width: '95%' }}
                                placeholder="Account #"
                                value={state.directJob_Account}
                                onChange={(value) => {
                                    dispatch(setDJField({ field: 'directJob_Account', value }))
                                }}
                                >
                                {state.directJob_SettlementAccounts.map(item => (
                                    <Select.Option key={item.id} value={item.id}>
                                    {`${item.title} - ${item.code}`}
                                    </Select.Option>
                                ))}
                            </Select>
                        <Row>
                        </Row>
                    </Col>
                </Col>
                <Col md={8}>
                    <Row>
                        <Col md={12}>
                            <label className="custom-label">Operation*</label>
                            <Select style={{width: '90%'}} placeholder="Entry #" value={state.directJob_Operation} onChange={(e) => {dispatch(setDJField({ field: 'directJob_Operation', value: e}))}}>
                                <Select.Option value="logistics">Logistics</Select.Option>
                                <Select.Option value="other">Other</Select.Option>
                            </Select>
                            <label className="custom-label">Cheq Date*</label>
                            <DatePicker format={'DD-MM-YYYY'} style={{width: '90%'}} value={state.directJob_ChequeDate} onChange={(e) => {dispatch(setDJField({ field: 'directJob_ChequeDate', value: e}))}}/>
                        </Col>
                        <Col md={12}>
                            <label className="custom-label">Job Type*</label>
                            <Select style={{width: '90%'}} placeholder="Job Type" value={state.directJob_JobType} onChange={(e) => {dispatch(setDJField({ field: 'directJob_JobType', value: e}))}}>
                                <Select.Option value="single">Single</Select.Option>
                                <Select.Option value="multiple">Multiple</Select.Option>
                            </Select>
                            <label className="custom-label">Currency</label>
                            <Select style={{width: '90%'}} placeholder="Currency" value={state.directJob_Currency} onChange={(e) => {dispatch(setDJField({ field: 'directJob_Currency', value: e}))}}>
                                <Select.Option value="PKR">PKR</Select.Option>
                                <Select.Option value="USD">USD</Select.Option>
                            </Select>
                        </Col>
                    </Row>
                    <Col md={24} style={{padding: '0'}}>
                            <label className="custom-label">Paid to</label>
                            <Select
                                showSearch
                                optionFilterProp="children"
                                style={{ width: '95%' }}
                                placeholder="Paid to..."
                                value={state.directJob_PaidTo}
                                onChange={(value) => {
                                    dispatch(setDJField({ field: 'directJob_PaidTo', value }))
                                }}
                                >
                                {state.directJob_CAccounts.map(item => (
                                    <Select.Option key={item.id} value={item.id}>
                                    {`${item.title} - ${item.code}`}
                                    </Select.Option>
                                ))}
                            </Select>
                        <Row>
                        </Row>
                    </Col>
                </Col>
            </Row>
            <Row>
                <Col md={8}>
                    <label className="custom-label">Drawn At</label>
                    <Input style={{width: '93%'}} placeholder="Drawn At" value={state.directJob_DrawnAt} onChange={(e) => {dispatch(setDJField({ field: 'directJob_DrawnAt', value: e.target.value}))}}/>
                </Col>
            </Row>
            <Row>
                <div style={{ width: '100%', overflowX: 'auto' }}>
                    <table style={{ width: '3000px', marginTop: '20px', borderCollapse: 'collapse', borderSpacing: 0 }}>
                        <thead style={{ backgroundColor: '#d6dbeb', height: '50px' }}>
                        <tr>
                            <th style={{ width: '2%', borderTopLeftRadius: '25px' }}>
                                <Button
                                    onClick={async () => {
                                        const temp = [...state.directJob];
                                        temp.push({
                                            id: 0,
                                            JobNumber: '',
                                            Charge: '',
                                            FileNumber: '',
                                            Basis: '',
                                            Currency: 'PKR',
                                            RateGroup: '',
                                            SizeType: '',
                                            Quantity: 0.0,
                                            Rate: 0.0,
                                            Amount: 0.0,
                                            Discount: 0.0,
                                            NetAmount: 0.0,
                                            TaxApply: false,
                                            TaxShare: 0.0,
                                            TaxAmount: 0.0,
                                            VATCategory: '',
                                            NetIncTaxAmount: 0.0,
                                            ExRate: 1.0,
                                            LocalAmount: 0.0,
                                            Description: '',
                                        })
                                        await dispatch(setDJField({ field: 'directJob', value: temp }));
                                    }}
                                    style={{
                                        width: '35px',
                                        height: '35px',
                                        padding: 0,
                                        marginLeft: '5px',
                                        backgroundColor: '#1f2937',
                                        color: 'white',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: 'none',
                                    }}
                                    >
                                        <PlusOutlined style={{ color: 'white', fontSize: '20px' }} />
                                </Button>
                            </th>
                            <th style={{ width: '5%' }}>Job #</th>
                            <th style={{ width: '10%' }}>Charges Name</th>
                            <th style={{ width: '5%' }}>File #</th>
                            <th style={{ width: '5%' }}>Basis</th>
                            <th style={{ width: '5%' }}>Currency</th>
                            <th style={{ width: '3%' }}>Rate Group</th>
                            <th style={{ width: '3%' }}>Size Type</th>
                            <th style={{ width: '3%' }}>Quantity</th>
                            <th style={{ width: '2.5%' }}>Rate</th>
                            <th style={{ width: '5%' }}>Amount</th>
                            <th style={{ width: '5%' }}>Discount</th>
                            <th style={{ width: '5%' }}>Net Amount</th>
                            <th style={{ width: '5%' }}>Tax Apply</th>
                            <th style={{ width: '3%' }}>Tax Share</th>
                            <th style={{ width: '5%' }}>Tax Amount</th>
                            <th style={{ width: '7%' }}>VAT Category</th>
                            <th style={{ width: '5%' }}>Net Inc Tax Amount</th>
                            <th style={{ width: '5%' }}>Exchange Rate</th>
                            <th style={{ width: '5%' }}>Local Amount</th>
                            <th style={{ width: '15%', borderTopRightRadius: '25px' }}>Description</th>
                        </tr>
                        </thead>
                        <tbody>
                            {state.directJob.map((item, index) => <tr key={index} style={{ height: '40px', borderBottom: '1px solid #d7d7d7' }}>
                                <td className="table-row number-cell">
                                    <span className="number">{index + 1}</span>
                                    <button className="delete-btn" onClick={() => {
                                        if(state.directJob.length > 1){
                                            const temp = [...state.directJob];
                                            temp.splice(index, 1);
                                            dispatch(setDJField({ field: 'directJob', value: temp }));
                                        }else{
                                            openNotification('Warning', `Cannot remove all items`, 'orange')
                                        }
                                    }}>
                                        <DeleteOutlined className="delete-icon" style={{ color: '#1f2937', fontSize: '20px' }} />
                                    </button>
                                </td>
                                <td className="table-row">
                                    <div style={{
                                        width: '90%',
                                        height: '30px',
                                        border: '1px solid #d7d7d7',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'start',
                                        padding: '15px 10px'
                                    }}
                                    onClick={() => {
                                        setShow(true)
                                        setSelector({type: 'multiple', index: index})
                                    }}
                                    >{item.JobNumber}</div>
                                </td>
                                <td className="table-row"><Select showSearch optionFilterProp="children" value={item.charge} onChange={(e) => {dispatch(updateDirectJobItem({ index: index, field: 'charge', value: e}))}} style={{ width: '90%' }} placeholder="Charges Name...">
                                    {state.directJob_Charges.map(item => (
                                        <Select.Option key={item.id} value={item.id}>
                                        {`(${item.code}) - ${item.name} - ${item.short}`}
                                        </Select.Option>
                                    ))}
                                    </Select></td>
                                <td className="table-row"><Input  value={item.FileNumber} onChange={(e) => {dispatch(updateDirectJobItem({ index: index, field: 'FileNumber', value: e.target.value}))}} style={{ width: '90%' }} placeholder="File #"/></td>
                                <td className="table-row"><Input value={item.Basis} onChange={(e) => {dispatch(updateDirectJobItem({ index: index, field: 'Basis', value: e.target.value}))}} style={{ width: '90%' }} placeholder="Basis"/></td>
                                <td className="table-row"><Select value={item.Currency} onChange={(e) => {dispatch(updateDirectJobItem({ index: index, field: 'Currency', value: e}))}} style={{ width: '90%' }} placeholder="Currency...">
                                        <Select.Option value='PKR'>PKR</Select.Option>
                                        <Select.Option value='USD'>USD</Select.Option>
                                    </Select></td>
                                <td className="table-row"><Select value={item.RateGroup} onChange={(e) => {dispatch(updateDirectJobItem({ index: index, field: 'RateGroup', value: e}))}} style={{ width: '90%' }} placeholder="Rate Group..."></Select></td>
                                <td className="table-row"><Input value={item.SizeType} onChange={(e) => {dispatch(updateDirectJobItem({ index: index, field: 'SizeType', value: e.target.value}))}} style={{ width: '90%' }} placeholder="Size Type"/></td>
                                <td className="table-row"><InputNumber value={item.Quantity} onChange={(e) => {dispatch(updateDirectJobItem({ index: index, field: 'Quantity', value: e}))}} style={{ width: '90%' }} placeholder="Quantity"/></td>
                                <td className="table-row"><InputNumber value={item.Rate} onChange={(e) => {dispatch(updateDirectJobItem({ index: index, field: 'Rate', value: e}))}} style={{ width: '90%' }} placeholder="Rate"/></td>
                                <td className="table-row"><InputNumber value={item.Amount} onChange={(e) => {dispatch(updateDirectJobItem({ index: index, field: 'Amount', value: e}))}} style={{ width: '90%' }} placeholder="Amount"/></td>
                                <td className="table-row"><InputNumber value={item.Discount} onChange={(e) => {dispatch(updateDirectJobItem({ index: index, field: 'Discount', value: e}))}} style={{ width: '90%' }} placeholder="Discount"/></td>
                                <td className="table-row"><InputNumber value={item.NetAmount} onChange={(e) => {dispatch(updateDirectJobItem({ index: index, field: 'NetAmount', value: e}))}} style={{ width: '90%' }} placeholder="Net Amount"/></td>
                                <td className="table-row">
                                    <Checkbox checked={item.TaxApply} onChange={(e) => {dispatch(updateDirectJobItem({ index: index, field: 'TaxApply', value: e.target.checked}))}} />
                                </td>
                                <td className="table-row"><InputNumber value={item.TaxShare} onChange={(e) => {dispatch(updateDirectJobItem({ index: index, field: 'TaxShare', value: e}))}} style={{ width: '90%' }} placeholder="Tax Share"/></td>
                                <td className="table-row"><InputNumber value={item.TaxAmount} onChange={(e) => {dispatch(updateDirectJobItem({ index: index, field: 'TaxAmount', value: e}))}} style={{ width: '90%' }} placeholder="Tax Amount"/></td>
                                <td className="table-row"><InputNumber value={item.VATCategory} onChange={(e) => {dispatch(updateDirectJobItem({ index: index, field: 'VATCategory', value: e}))}} style={{ width: '90%' }} placeholder="VAT Category"/></td>
                                <td className="table-row"><InputNumber value={item.NetIncTaxAmount} onChange={(e) => {dispatch(updateDirectJobItem({ index: index, field: 'NetIncTaxAmount', value: e}))}} style={{ width: '90%' }} placeholder="Net Inc Tax Amount"/></td>
                                <td className="table-row"><InputNumber value={item.ExRate} onChange={(e) => {dispatch(updateDirectJobItem({ index: index, field: 'ExRate', value: e}))}} style={{ width: '90%' }} placeholder="Exchange Rate"/></td>
                                <td className="table-row"><InputNumber value={item.LocalAmount} onChange={(e) => {dispatch(updateDirectJobItem({ index: index, field: 'LocalAmount', value: e}))}} style={{ width: '90%' }} placeholder="Local Amount"/></td>
                                <td className="table-row"><Input value={item.Description} onChange={(e) => {dispatch(updateDirectJobItem({ index: index, field: 'Description', value: e.target.value}))}} style={{ width: '90%' }} placeholder="Description"/></td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </Row>
            <Row>
                <Col md={12}>
                    <label className="custom-label">Remarks</label>
                    <Input.TextArea value={state.directJob_Remarks} onChange={(e) => {dispatch(setDJField({ field: 'directJob_Remarks', value: e.target.value}))}} name="Remarks" rows={4} style={{ width: '95%', height: '135px' }} placeholder="Remarks..." />
                </Col>
                <Col md={12}>
                    <div className="totals-box">
                    <div className="totals-label">Totals</div>
                    <Row>
                        <Col md={12}>
                            <div>
                                <p style={{marginTop:5}}><b>Total Amount:</b> <span>{commas(state.directJob_TotalAmount)}</span></p>
                                <p style={{marginTop:5}}><b>Net Amount:</b> <span>{commas(state.directJob_TotalNetAmount)}</span></p>
                                <p style={{marginTop:5}}><b>Net Amount Inc Tax:</b> <span>{commas(state.directJob_TotalNetAmountIncTax)}</span></p>
                            </div>
                        </Col>
                        <Col md={12}>
                            <div>
                                <p style={{marginTop:5}}><b>Discount:</b> <span>{commas(state.directJob_TotalDiscount)}</span></p>
                                <p style={{marginTop:5}}><b>Tax Amount:</b> <span>{commas(state.directJob_TotalTaxAmount)}</span></p>
                                <p style={{marginTop:5}}><b>Local Amount:</b> <span>{commas(state.directJob_TotalLocalAmount)}</span></p>
                            </div>
                        </Col>
                    </Row>
                    <div className="totals-content">
                    </div>
                    </div>
                </Col>
            </Row>
            <Modal
                open={show}
                onOk={() => setShow(false)}
                onCancel={() => setShow(false)}
                width={1000}
                footer={false}
                centered={false}
            >
                <div style={{ height: '70vh'}}>
                    <Row style={{borderBottom: '2px solid #1d1d1f'}}>
                        <Col md={8}>
                            <h3>Job Selection</h3>
                        </Col>
                        <Col md={10}>
                            <Input
                                placeholder="Search Job #"
                                prefix={<SearchOutlined />}
                                style={{ width: '75%' }}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Col>
                        <Col md={6}>
                            <Pagination 
                                current={currentPage} 
                                pageSize={pageSize} 
                                total={state.directJob_Jobs.length} 
                                onChange={(page) => setCurrentPage(page)} 
                                size="large"
                                showSizeChanger={false}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', borderSpacing: 0 }}>
                            <thead style={{ backgroundColor: '#d6dbeb', height: '50px' }}>
                                <tr>
                                    <th style={{ width: '5%', paddingLeft: '10px', borderTopLeftRadius: '25px' }}>#</th>
                                    <th style={{ width: '15%', paddingLeft: '10px' }}>Job #</th>
                                    <th style={{ width: '20%', paddingLeft: '10px' }}>HBL</th>
                                    <th style={{ width: '20%', paddingLeft: '10px' }}>MBL</th>
                                    <th style={{ width: '20%', paddingLeft: '10px' }}>Client</th>
                                    <th style={{ width: '20%', paddingLeft: '10px', borderTopRightRadius: '25px' }}>Consignee</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords.map((record, index) => (
                                    <tr key={index} style={{ height: '40px', borderBottom: '1px solid #d7d7d7' }}
                                        onClick={() => {
                                            if(selector.type == 'single'){
                                                dispatch(setDJField({ field: 'directJob_JobId', value: record.id }))
                                                dispatch(setDJField({ field: 'directJob_JobNumber', value: record.jobNo }))
                                                setShow(false)
                                            }else if(selector.type == 'multiple'){
                                                dispatch(updateDirectJobItem({ index: selector.index, field: 'JobId', value: record.id }));
                                                dispatch(updateDirectJobItem({ index: selector.index, field: 'JobNumber', value: record.jobNo }));
                                                setShow(false)
                                            }
                                        }}
                                    >
                                        <td className="table-row1">{index+1}</td>
                                        <td className="table-row1">{record.jobNo}</td>
                                        <td className="table-row1">{record.Bl?.hbl}</td>
                                        <td className="table-row1">{record.Bl?.mbl}</td>
                                        <td className="table-row1">{record.Client.name}</td>
                                        <td className="table-row1">{record.consignee.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Row>
                </div>
            </Modal>
        </div>
    );
};

export default DirectJob