import { createSlice } from '@reduxjs/toolkit';
import { Rate } from 'antd';
import moment from 'moment';

const initialState = {
    directJob_Id: '',
    directJob_EntryNumber: 'SNS-AEJ-1/26',
    directJob_JobId:0,
    directJob_JobNumber:"",
    directJob_ExRate: 1,
    directJob_EntryDate: moment(),
    directJob_FileNumber:"",
    directJob_TransMode:"Bank",
    directJob_Type:"revenue",
    directJob_SubType:"cheque",
    directJob_Account: undefined,
    directJob_Reference:"",
    directJob_ChequeNo:"",
    directJob_Operation:"logistics",
    directJob_ChequeDate: moment(),
    directJob_PaidTo: undefined,
    directJob_JobType:"single",
    directJob_Currency:"PKR",
    directJob_DrawnAt: "",
    directJob_ClosingBalance: 0.0,
    directJob_Edit: false,
    directJob_VoucherNumber: '',
    directJob_SettlementAccounts: [],
    directJob_CAccounts: [],
    directJob_Charges: [],
    directJob_Jobs: [],
    directJob: [
      {
        id: 0,
        JobId: 0,
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
      },
    ],
    directJob_CompanyId:1,
    directJob_TotalAmount: 0.0,
    directJob_TotalNetAmount: 0.0,
    directJob_TotalNetAmountIncTax: 0.0,
    directJob_TotalDiscount: 0.0,
    directJob_TotalTaxAmount: 0.0,
    directJob_TotalLocalAmount: 0.0,
    directJob_Remarks: '',

}

export const directJobSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    setDJField(state, action) {
        const { field, value } = action.payload;
        if (field in state) {
          state[field] = value;
        } else {
          console.warn(`DirectJob Field "${field}" does not exist in the state.`);
        }
      },
    updateDirectJobItem(state, action) {
      const { index, field, value } = action.payload;

      if (state.directJob[index]) {
        state.directJob[index][field] = value;
      } else {
        console.warn(`Index ${index} does not exist in directJob array.`);
      }
    },
    resetDirectJob(state, action) {
      console.log("reset");
      return initialState;
    },
  },
});

export const { setDJField, resetDirectJob, updateDirectJobItem } = directJobSlice.actions;

export default directJobSlice.reducer;
