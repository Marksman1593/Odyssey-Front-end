import { Checkbox } from "antd";
import { useController } from "react-hook-form";
import { memo } from "react";

//const CheckGroupComp = ({ control, name, label, ...rest }) => {
const CheckGroupComp = (props) => {
  const { control, name } = props;
  const { field: { onChange, onBlur, value, name: fieldName, ref } } = useController({ control, name });

  return (
    <>
      <div>{props.label}</div>
      <Checkbox.Group  name={fieldName} onChange={onChange} value={value} ref={ref} onBlur={onBlur} 
        {...props.rest}
        disabled={props.disabled}
        options={props.options}
        style={{width:props.width, fontSize:12}}
      />
    </>
  )
}

export default memo(CheckGroupComp)

// import { Checkbox } from "antd";
// import { useController } from "react-hook-form";
// import { memo, useMemo } from "react";

// const CheckGroupComp = (props) => {
//   const { control, name, label, options = [], disabled, width } = props;

//   const {
//     field: { onChange, onBlur, value = [], name: fieldName, ref },
//   } = useController({ control, name });

//   // Derived state: whether all options are currently selected
//   const allSelected = useMemo(() => value?.length === options.length, [value, options]);

//   // Toggle Select All
//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       onChange(options.map((opt) => opt.value)); // select all
//     } else {
//       onChange([]); // deselect all
//     }
//   };

//   return (
//     <>
//       {label && <div style={{ fontWeight: 500, marginBottom: 4 }}>{label}</div>}

//       {/* Select All Checkbox */}
//       <div style={{ marginBottom: 6 }}>
//         <Checkbox
//           checked={allSelected}
//           indeterminate={value.length > 0 && value.length < options.length}
//           onChange={handleSelectAll}
//           disabled={disabled}
//         >
//           Select All
//         </Checkbox>
//       </div>

//       {/* Checkbox Group */}
//       <Checkbox.Group
//         name={fieldName}
//         onChange={onChange}
//         value={value}
//         ref={ref}
//         onBlur={onBlur}
//         disabled={disabled}
//         options={options}
//         style={{ width, fontSize: 12 }}
//       />
//     </>
//   );
// };

// export default memo(CheckGroupComp);
