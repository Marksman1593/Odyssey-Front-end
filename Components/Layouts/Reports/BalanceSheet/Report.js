import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Spinner } from 'react-bootstrap';
import { Select, Radio, Modal } from 'antd';

const Report = () => {

  const [company, setCompany] = useState(1);
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState(false);

  const [accounts, setAccounts] = useState([]);
  const [assets, setAssets] = useState([{ total:0.00, children:[{}] }]);
  const [liabilities, setLiabilities] = useState([{ total:0.00, children:[{}] }]);
  const [capital, setCapital] = useState([{ total:0.00, children:[{}] }]);
  const [drawings, setDrawings] = useState([{ total:0.00, children:[{}] }]);
  const [earnings, setEarnings] = useState(0.00);
  const [effect, setEffect] = useState(0.00);
  const commas = (a) =>  { return parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}
  async function handleSubmit(){
    setLoad(true);
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL+"/accounts/balanceSheetOld",{
      headers:{
        companyid:company
      }
    })
    .then((x)=>{
      console.log("Balance Sheet", x.data)
      setAccounts(x.data.result.accounts);
      // let tempassets = x.data.result.assets;
      // let templiabilities = x.data.result.liabilities;
      // let tempcapital = x.data.result.capital;
      // let tempdrawings = x.data.result.drawings;
      // let tempselling = x.data.result.selling;
      // let tempcosting = x.data.result.costing;
      // tempassets.forEach((z) => {
      //     let total = 0.00;
      //     z.children.forEach((i)=>{
      //         let totalParent = 0.00;
      //         i.children.forEach((j)=>{
      //             let totalChild = 0.00;
      //             j.Voucher_Heads.forEach((k)=>{
      //                 let totalVoucher = 0.00;
      //                 k.type=="debit"?totalVoucher = totalVoucher + parseFloat(k.amount):totalVoucher = totalVoucher - parseFloat(k.amount);
      //                 totalChild = totalChild + totalVoucher
      //             })
      //             j.totalChild = totalChild;
      //             totalParent = totalParent + totalChild
      //         })
      //         i.totalParent = totalParent
      //         total = total + totalParent
      //     })
      //     z.total = total;
      // });
      // templiabilities.forEach((z) => {
      //     let total = 0.00;
      //     z.children.forEach((i)=>{
      //         let totalParent = 0.00;
      //         i.children.forEach((j)=>{
      //             let totalChild = 0.00;
      //             j.Voucher_Heads.forEach((k)=>{
      //                 let totalVoucher = 0.00;
      //                 k.type=="credit"?totalVoucher = totalVoucher + parseFloat(k.amount):totalVoucher = totalVoucher - parseFloat(k.amount);
      //                 totalChild = totalChild + totalVoucher
      //             })
      //             j.totalChild = totalChild;
      //             totalParent = totalParent + totalChild
      //         })
      //         i.totalParent = totalParent
      //         total = total + totalParent
      //     })
      //     z.total = total;
      // });
      // tempcapital.forEach((z) => {
      //     let total = 0.00;
      //     z.children.forEach((i)=>{
      //         let totalParent = 0.00;
      //         i.children.forEach((j)=>{
      //             let totalChild = 0.00;
      //             j.Voucher_Heads.forEach((k)=>{
      //                 let totalVoucher = 0.00;
      //                 k.type=="credit"?totalVoucher = totalVoucher + parseFloat(k.amount):totalVoucher = totalVoucher - parseFloat(k.amount);
      //                 totalChild = totalChild + totalVoucher
      //             })
      //             j.totalChild = totalChild;
      //             totalParent = totalParent + totalChild
      //         })
      //         i.totalParent = totalParent
      //         total = total + totalParent
      //     })
      //     z.total = total;
      // });
      // tempdrawings.forEach((z) => {
      //     let total = 0.00;
      //     z.children.forEach((i)=>{
      //         let totalParent = 0.00;
      //         i.children.forEach((j)=>{
      //             let totalChild = 0.00;
      //             j.Voucher_Heads.forEach((k)=>{
      //                 let totalVoucher = 0.00;
      //                 k.type=="credit"?totalVoucher = totalVoucher + parseFloat(k.amount):totalVoucher = totalVoucher - parseFloat(k.amount);
      //                 totalChild = totalChild + totalVoucher
      //             })
      //             j.totalChild = totalChild;
      //             totalParent = totalParent + totalChild
      //         })
      //         i.totalParent = totalParent
      //         total = total + totalParent
      //     })
      //     z.total = total;
      // });
      // tempcosting.forEach((z) => {
      //     let total = 0.00;
      //     z.children.forEach((i)=>{
      //         let totalParent = 0.00;
      //         i.children.forEach((j)=>{
      //             let totalChild = 0.00;
      //             j.Voucher_Heads.forEach((k)=>{
      //                 let totalVoucher = 0.00;
      //                 k.type=="debit"?totalVoucher = totalVoucher + parseFloat(k.amount):totalVoucher = totalVoucher - parseFloat(k.amount);
      //                 totalChild = totalChild + totalVoucher
      //             })
      //             j.totalChild = totalChild;
      //             totalParent = totalParent + totalChild
      //         })
      //         i.totalParent = totalParent
      //         total = total + totalParent
      //     })
      //     z.total = total;
      // });
      // tempselling.forEach((z) => {
      //     let total = 0.00;
      //     z.children.forEach((i)=>{
      //         let totalParent = 0.00;
      //         i.children.forEach((j)=>{
      //             let totalChild = 0.00;
      //             j.Voucher_Heads.forEach((k)=>{
      //                 let totalVoucher = 0.00;
      //                 k.type=="debit"?totalVoucher = totalVoucher + parseFloat(k.amount):totalVoucher = totalVoucher - parseFloat(k.amount);
      //                 totalChild = totalChild + totalVoucher
      //             })
      //             j.totalChild = totalChild;
      //             totalParent = totalParent + totalChild
      //         })
      //         i.totalParent = totalParent
      //         total = total + totalParent
      //     })
      //     z.total = total;
      // });
      // tempselling = tempselling.length>0?tempselling[0].total:0;
      // tempcosting = tempcosting.length>0?tempcosting[0].total:0;
      // setAssets(tempassets)
      // setLiabilities(templiabilities)
      // // console.log(tempcapital, "<----here")
      // setCapital(tempcapital)
      // setDrawings(tempdrawings)
      // setEarnings(tempselling+tempcosting);
      // setEffect(tempassets[0].total - ( templiabilities.length>0?templiabilities[0].total:0 + tempcapital.length>0?tempcapital[0].total:0 + tempdrawings.length>0?tempdrawings[0].total:0 + tempselling+tempcosting))
      // // console.log("assets",tempassets);
      // // console.log("liabilities",templiabilities);
      // // console.log("capital",tempcapital);
      // // console.log("drawings",tempdrawings);
      // // console.log("selling",tempselling);
      // // console.log("costing",tempcosting);
    })
    setLoad(false);
    setVisible(true);
  }
  const lineHeight = 1.1;

  useEffect(()=>{
    handleSubmit()
  }, [])

  // Calculate total recursively
const calculateTotals = (account) => {
  let total = (account.Voucher_Heads || []).reduce((sum, vh) => {
    return vh.type === "debit"
      ? sum + Number(vh.defaultAmount || 0)
      : sum - Number(vh.defaultAmount || 0);
  }, 0);

  if (account.children && account.children.length > 0) {
    const childrenTotal = account.children.reduce(
      (sum, child) => sum + calculateTotals(child),
      0
    );
    total += childrenTotal;
  }

  account.total = total; // store total for rendering
  return total;
};

// Recursive row renderer (skip accounts with 0 total)
const renderAccountRows = (account, level = 0) => {
  if (!account.total || account.total === 0) return []; // skip zero balances

  const rows = [];
  const isLeaf = !account.children || account.children.length === 0;

  // Render the account row itself
  rows.push(
    <tr key={account.id}>
      <td style={{ paddingLeft: `${level * 20}px`, fontWeight: isLeaf ? "normal" : "bold" }}>
        {account.title}
      </td>
      <td style={{ textAlign: "right" }}>
        {account.total?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
    </tr>
  );

  // Render children recursively
  if (!isLeaf) {
    account.children.forEach(child => {
      rows.push(...renderAccountRows(child, level + 1));
    });

    // Render total row for this parent (after all children)
    rows.push(
      <tr key={`${account.id}-total`}>
        <td style={{ paddingLeft: `${(level + 1) * 20}px`, fontStyle: "italic", fontWeight: "bold"  }}>
          Total for {account.title}
        </td>
        <td style={{ textAlign: "right", fontStyle: "italic", borderTop: "2px solid #000" }}>
          {account.total?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </td>
      </tr>
    );
  }

  return rows;
};

const BalanceSheet = ({ accounts }) => {
  // Calculate totals for all roots
  accounts.forEach(calculateTotals);

  // Only include accounts with active balance
  const activeAccounts = accounts.filter(account => account.total && account.total !== 0);

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left" }}>Account</th>
          <th style={{ textAlign: "right" }}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {activeAccounts.flatMap(account => renderAccountRows(account))}
      </tbody>
    </table>
  );
};

  return (
  <div className='base-page-layout p-4'>
    <h4 className='fw-7'>Balance Sheet</h4>
    <hr/>
    <BalanceSheet accounts={accounts} />
    {/* <div style={{minHeight:650, overflowY:'auto', overflowX:'hidden', fontSize:14, padding:20}}>
      <h4 className='mb-0 pb-0'>Assets</h4>
      {assets.length>0 &&
        <>
        {assets[0].children.map((x, i)=>{
        return(
            <Row key={i} className='row-btm-line' style={{lineHeight:lineHeight}}>
                <Col md={6}><div>{x.title}</div></Col>
                <Col md={6}><div className='fl-r'>{commas(x.totalParent)}</div></Col>
            </Row>
        )})}
        <Row className='row-btm-line fw-8'  style={{lineHeight:lineHeight}}>
            <Col md={6} className='px-4'><div>Total For Assets</div></Col>
            <Col md={6}><div className='fl-r'>{commas(assets[0].total)}</div></Col>
        </Row>
        </>
      }
      <h4 className='mb-0 pb-0 mt-3'>liabilities</h4>
      {liabilities[0].children.map((x, i)=>{
      return(
        <Row key={i} className='row-btm-line'  style={{lineHeight:lineHeight}}>
          <Col md={6}><div>{x.title}</div></Col>
          <Col md={6}><div className='fl-r'>{commas(x.totalParent)}</div></Col>
        </Row>
      )})}
      <Row className='row-btm-line fw-8'  style={{lineHeight:lineHeight}}>
        <Col md={6} className='px-4'><div>Total For Liabilities</div></Col>
        <Col md={6}><div className='fl-r'>{commas(liabilities[0].total)}</div></Col>
      </Row>
      <h4 className='mb-0 pb-0 mt-3'>Equity</h4>
      {capital[0]?.children.map((x, i)=>{
      return(
        <Row key={i} className='row-btm-line'  style={{lineHeight:lineHeight}}>
          <Col md={6}><div>{x.title}</div></Col>
          <Col md={6}><div className='fl-r'>{commas(x.totalParent)}</div></Col>
        </Row>
      )})}
      <Row className='row-btm-line fw-8'  style={{lineHeight:lineHeight}}>
        <Col md={6} className='px-4'><div>Total For Capital</div></Col>
        <Col md={6}><div className='fl-r'>{capital.length>0? commas(capital[0]?.total):'0.00'}</div></Col>
      </Row>
      {drawings.length>0 &&
      <>
        {drawings[0].children.map((x, i)=>{
        return(
          <Row key={i} className='row-btm-line'  style={{lineHeight:lineHeight}}>
            <Col md={6}><div>{x.title}</div></Col>
            <Col md={6}><div className='fl-r'>{commas(x.totalParent)}</div></Col>
          </Row>
        )})}
        <Row className='row-btm-line fw-8'  style={{lineHeight:lineHeight}}>
          <Col md={6} className='px-4'><div>Total For Drawings</div></Col>
          <Col md={6}><div className='fl-r '>{commas(drawings[0]?.total)}</div></Col>
        </Row>
      </>
      }
      <Row className='row-btm-line'  style={{lineHeight:lineHeight}}>
        <Col md={6} className=''><div>Profit & Loss Summary</div></Col>
        <Col md={6}><div className='fl-r '>{commas(earnings)}</div></Col>
      </Row>
      <Row className='row-btm-line fw-8'  style={{lineHeight:lineHeight}}>
        <Col md={6} className='px-4'><div>Total for Profit & Loss Summary</div></Col>
        <Col md={6}><div className='fl-r '>{commas(earnings)}</div></Col>
      </Row>
      <Row className='row-btm-line'  style={{lineHeight:lineHeight}}>
        <Col md={6} className=''><div>{effect>0?"Asset":"Liability"} Effect On Equity</div></Col>
        <Col md={6}><div className='fl-r '>{commas(effect)}</div></Col>
      </Row>
      <Row className='row-btm-line fw-8'  style={{lineHeight:lineHeight}}>
        <Col md={6} className='px-4'><div>Total for Equity & Liability</div></Col>
        <Col md={6}><div className='fl-r '>{commas(assets[0].total)} </div></Col>
      </Row>
    </div> */}
    
  </div>
  )
}

export default Report