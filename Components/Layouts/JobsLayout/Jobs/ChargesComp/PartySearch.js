// import { Table } from 'react-bootstrap';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Tag, Switch, Input } from 'antd';
// import { CheckCircleOutlined } from "@ant-design/icons"

// const PartySearch = ({state, dispatch, reset, useWatch, control}) => {

//   const [partyType, setPartyType] = useState('client');
//   const [searchTerm, setSearchTerm] = useState('');
//   const chargeList = useWatch({ control, name: 'chargeList' });
  
//   const getClients = async() => {
//     await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CLIENTS)
//     .then((x) => {
//       dispatch({type:'toggle', fieldName:'clientParties', payload:x.data.result});
//     })
//   }
  
//   const getVendors = async() => {
//     await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_VENDOR_FOR_PARTY_SEARCH)
//     .then((x) => {
//       let data = [];
//       x.data.result.forEach(x => {
//         data.push({...x, check:false})
//       });
//       dispatch({type:'toggle', fieldName:'vendorParties', payload:data});
//     })
//   }

//   useEffect(() => {
//     getClients();
//     getVendors();
//   }, [])

//   const RenderData = ((props) => {
//     return(
//     <>
//       {props.data.filter((x)=>{
//         // console.log("x",x)
//         if(
//           x?.name?.toLowerCase().includes(searchTerm.toLowerCase())||
//           x?.code?.toLowerCase().includes(searchTerm.toLowerCase())||
//           x?.types?.toLowerCase().includes(searchTerm.toLowerCase())
//         ){ return x }
//         if(searchTerm==""){ return x }
//       }).map((x, i)=> {
//       return(
//       <tr key={i} className={`${x.check?"table-select-list-selected":"table-select-list"}`} onClick={()=>{
//         if(!x.check){
//           let temp = props.type=="vendors"?[...state.vendorParties]:[...state.clientParties];
//           temp.forEach((y, i2)=>{
//             if(y.id==x.id){ temp[i2].check=true
//             } else { temp[i2].check=false }
//           })
//           dispatch({type:'toggle', fieldName:props.type=="vendors"?'vendorParties':'clientParties', payload:temp});
//         } else {
//           let temp = [];
//           temp = chargeList;
//           if(state.chargesTab=='1'){
//             console.log(x)
//             if(x.types.includes("Overseas Agent")){
//               temp[state.headIndex].invoiceType = "Agent Invoice";
//               temp[state.headIndex].partyType = "agent";
              
//             }else if(x.types.includes("Local Vendor")){
//               temp[state.headIndex].invoiceType = "Job Invoice";
//               temp[state.headIndex].partyType = "vendor";
              
//             }else{
//               temp[state.headIndex].invoiceType = "Job Invoice";
              
//             }
//           }
//           else {
//             console.log(x)
//             if(x.types.includes("Overseas Agent")){
//               temp[state.headIndex].invoiceType = "Agent Bill";
//               temp[state.headIndex].partyType = "agent";
              
//             }else if(x.types.includes("Local Vendor")){
//               temp[state.headIndex].invoiceType = "Job Bill";
//               temp[state.headIndex].partyType = "vendor";
              
//             }else{
//               temp[state.headIndex].invoiceType = "Job Bill";
              
//             }
//             // temp[state.headIndex].invoiceType = x.types?.includes("Overseas Agent")?"Agent Invoice":"Job Bill" ;
//           }
//           temp[state.headIndex] = {
//             ...temp[state.headIndex], 
//             name:x.name, 
//             partyId:x.id, 
//             partyType:temp[state.headIndex].partyType!="agent"?partyType:temp[state.headIndex].partyType
//           }
//           reset({ chargeList: temp });

//           let tempOne = [...state.vendorParties];
//           let tempTwo = [...state.clientParties];

//           tempOne.forEach((y, i1)=>{
//             tempOne[i1].check=false
//           });
//           tempTwo.forEach((y, i1)=>{
//             tempTwo[i1].check=false
//           });

//           dispatch({ type:'set', payload:{headIndex:"", headVisible:false, vendorParties:tempOne, clientParties:tempTwo} })
//         }
//       }}>
//         <td className='pt-1 text-center px-3'> {x.check?<CheckCircleOutlined style={{color:'green', position:'relative', bottom:2}} />:i+1 } </td>
//         <td className='pt-1' style={{whiteSpace:"nowrap"}}><strong>{x.code}</strong></td>

//         <td className='pt-1' style={{whiteSpace:"nowrap"}}><strong>{x.name}</strong></td>
//         <td className='pt-1 text-center'>
//           {x.types?.split(", ").map((y, i2)=>{
//             return <Tag key={i2} color="purple" className='mb-1'>{y}</Tag>
//           })}
//         </td>
//         <td className='pt-1 text-center'>{x.city}</td>
//         <td className='pt-1 text-center'>
//           <Tag color="geekblue" className='mb-1'>{x.person1}</Tag>
//         </td>
//         <td className='pt-1 text-center'><Tag color="cyan" className='mb-1'>{x.mobile1}</Tag></td>
//       </tr>
//       )})}
//     </>
//     )
//   })

//   return(
//     <>
//     <h5>Party Selection</h5>
//     <hr/>
//     {/* <Switch checked={partyType!="vendor"}
//       onChange={() => {
//         partyType=="vendor"?setPartyType("client"):setPartyType("vendor")
//       }}
//     /> */}
//     <span className='mx-2'><b>{partyType}</b></span>
//     <Input style={{width:200}} placeholder='Search by Code or Name' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
//     <div className='table-sm-1 mt-4' style={{maxHeight:300, overflowY:'auto'}}>
//       <Table className='tableFixHead'>
//       <thead>
//         <tr>
//           <th className='text-center'>#</th>
//           <th className='text-center'>Code</th>
//           <th className='text-center'>Name</th>
//           <th className='text-center'>Types</th>
//           <th className='text-center'>City</th>
//           <th className='text-center'>Contact Persons</th>
//           <th className='text-center'>Mobile</th>
//         </tr>
//       </thead>
//       <tbody>
//       <RenderData data={partyType=="vendor"?state.vendorParties:state.clientParties} type={partyType=="vendor"?'vendors':'clients'} searchTerm={searchTerm} />
//       </tbody>
//       </Table>
//     </div>
//     <div>
//     </div>
//     </>
//   )
// }

// export default React.memo(PartySearch)

import { Table } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tag, Input, Pagination } from 'antd';
import { CheckCircleOutlined } from "@ant-design/icons";

const PartySearch = ({ state, dispatch, reset, useWatch, control }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const chargeList = useWatch({ control, name: 'chargeList' });

  const getClients = async () => {
    const res = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CLIENTS);
    console.log("Clients:", res.data.result);
    dispatch({ type: 'toggle', fieldName: 'clientParties', payload: res.data.result });
  };

  useEffect(() => {
    getClients();
  }, []);

  const filtered = state.clientParties.filter((x) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      x?.name?.toLowerCase().includes(term) ||
      x?.code?.toLowerCase().includes(term) ||
      x?.types?.toLowerCase().includes(term)
    );
  });

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const Row = ({ x, i }) => (
    <tr
      key={i}
      className={`${x.check ? "table-select-list-selected" : "table-select-list"}`}
      onClick={() => {
        if (!x.check) {
          const temp = [...state.clientParties];
          temp.forEach((y, idx) => {
            temp[idx].check = y.id === x.id;
          });
          dispatch({ type: 'toggle', fieldName: 'clientParties', payload: temp });
        } else {
          let temp = [...chargeList];

          if (state.chargesTab == '1') {
            if (x.types.includes("Overseas Agent")) {
              temp[state.headIndex].invoiceType = "Agent Invoice";
              temp[state.headIndex].partyType = "agent";
            } else {
              temp[state.headIndex].invoiceType = "Job Invoice";
            }
          } else {
            if (x.types.includes("Overseas Agent")) {
              temp[state.headIndex].invoiceType = "Agent Bill";
              temp[state.headIndex].partyType = "agent";
            } else {
              temp[state.headIndex].invoiceType = "Job Bill";
            }
          }

          temp[state.headIndex] = {
            ...temp[state.headIndex],
            name: x.name,
            partyId: x.id,
          };

          reset({ chargeList: temp });

          const cleared = state.clientParties.map((c) => ({ ...c, check: false }));
          dispatch({ type: 'set', payload: { headIndex: "", headVisible: false, clientParties: cleared } });
        }
      }}
    >
      <td className='pt-1 text-center px-3'>
        {x.check ? <CheckCircleOutlined style={{ color: 'green', position: 'relative', bottom: 2 }} /> : i + 1}
      </td>
      <td className='pt-1'><strong>{x.code}</strong></td>
      <td className='pt-1'><strong>{x.name}</strong></td>
      <td className='pt-1 text-center'>
        {x.types?.split(", ").map((y, k) => (
          <Tag key={k} color="purple" className='mb-1'>{y}</Tag>
        ))}
      </td>
      <td className='pt-1 text-center'>{x.city}</td>
      <td className='pt-1 text-center'>
        <Tag color="geekblue" className='mb-1'>{x.person1}</Tag>
      </td>
      <td className='pt-1 text-center'>
        <Tag color="cyan" className='mb-1'>{x.mobile1}</Tag>
      </td>
    </tr>
  );

  return (
    <>
      <h5>Party Selection</h5>
      <hr />

      <Input
        style={{ width: 200 }}
        placeholder='Search by Code or Name'
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />

      <div className='table-sm-1 mt-4' style={{ maxHeight: 300, overflowY: 'auto' }}>
        <Table className='tableFixHead'>
          <thead>
            <tr>
              <th className='text-center'>#</th>
              <th className='text-center'>Code</th>
              <th className='text-center'>Name</th>
              <th className='text-center'>Types</th>
              <th className='text-center'>City</th>
              <th className='text-center'>Contact Persons</th>
              <th className='text-center'>Mobile</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((x, i) => (
              <Row key={i} x={x} i={(currentPage - 1) * pageSize + i} />
            ))}
          </tbody>
        </Table>
      </div>

      <Pagination
        current={currentPage}
        total={filtered.length}
        pageSize={pageSize}
        onChange={(p) => setCurrentPage(p)}
        style={{ marginTop: 10, textAlign: 'center' }}
      />
    </>
  );
};

export default React.memo(PartySearch);
