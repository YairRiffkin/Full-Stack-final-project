import { ItemFormDetail } from "../../models/formtypes";
import { Item, NewItem, initializeItem, newItem } from "../../models/itemtypes";
import { ItemFormDetails, notRequired } from "../pages/ItemFormDisplayElements";

export function CheckItemLine(name: string, value: string) {
  console.log("name: ", name, "value: ", value);
  let warning = "";
  if (value) {
    const trimmedValue = value.trim();
    if (value === "--Choose--") { warning = "You must choose an option" }
    if (value !== trimmedValue) { warning = "No spaces allowed at beginning or end of line" }
    if (name === "shortEnglishDescription" || name === "longEnglishDescription") {
      console.log("in english check")
      const isEnglishString = [...value].every(char => char >= '\u0000' && char <= '\u007F');
      if (!isEnglishString) { warning = "Description MUST be in english" }
    }
    
  } else {
    const isRequired = !notRequired.includes(name);
    if (isRequired) { warning = "Data is required"}
  }
  return warning
}

export function CheckItemComplete(form: NewItem, warnings: string[]) {
  let result: boolean = false;
  // console.log("warnings: ", warnings)
  warnings.map((warning) => {
    if (warning !== "") { result = true; }
  });
  return false
}

export function ItemDefaultWarning() {
    const warnings: string[] = [];
    const string1: string = "You must choose an option";
    const string2: string = "Data is required";
    const itemFormDetails: ItemFormDetail[] = ItemFormDetails;
    const initialItem: Item = initializeItem();
    itemFormDetails.map(( itemDetail, index ) => {
            warnings[index] = "";
            const isRequired = !notRequired.includes(itemDetail.name);
            const itemRequired = (isRequired && !initialItem[itemDetail.name as keyof Item]) ? true : false;
            if (itemDetail.element === "select") {
              const itemValue = initialItem[itemDetail.name as keyof Item];
              warnings[index] = itemValue ? "" : string1;
            } else {
              warnings[index] = itemRequired ? string2 : "";
            }
            

        });
  return warnings;
}

export function ItemWarningDisplay(warning: string | null) {
  // console.log("in display warnings", warning)
  if (warning) {
    return (
          <>
          <small>{ warning }. </small><br />
          </>
    );
  } else {
    return null;
  }
}

export function ItemIssues(error: string[]) {
  return  <small>Please address the below issues before submitting: 
            <ol>
              { error.map((item, index) => (
                  <li key = { index }>{ item }.</li>
              ))}
            </ol>
          </small>
}
