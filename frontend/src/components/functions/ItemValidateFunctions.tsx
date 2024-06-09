import { ItemFormDetail } from "../../models/formtypes";
import { Item, initializeItem } from "../../models/itemtypes";
import { CostCenterList, ItemFormDetails, LocationList, MaterialTypeList, StorageLocList, notRequired } from "../pages/ItemFormDisplayElements";

export function CheckItemLine(name: string, value: string) {
  /*Checking a single input for:
      1. Where select has not been chosen.
      2. No leading or lagging spaces.
      3. English description contain only english characters.
      4. Required data is not left out. */

  let warning = "";
  if (value) {
    const trimmedValue = value.trim();
    if (value === "--Choose--") { warning = "You must choose an option" }
    if (value !== trimmedValue) { warning = "No spaces allowed at beginning or end of line" }
    if (name === "shortEnglishDescription" || name === "longEnglishDescription") {
      const isEnglishString = [...value].every(char => char >= '\u0000' && char <= '\u007F');
      if (!isEnglishString) { warning = "Description MUST be in english" }
    }
    
  } else {
    const isRequired = !notRequired.includes(name);
    if (isRequired) { warning = "Data is required"}
  }
  return warning
}

export function CheckItemComplete(warnings: string[]) {
  /*Checking if no errors exist before allowing submit*/
  let result: boolean = false;
  if (warnings && Array.isArray(warnings)) {
    warnings.forEach((warning) => {
      if (warning !== "") { result = true; }
    });
  }
  return result
}

export function ItemDefaultWarning() {
  /*Default warning list to allow showing errors at first render */
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
  /*Display warning in form */
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

export function DefaultDisplay(name: string, value: string) {
  const correction: { [key: string]: string | null | undefined } = {};

  if (name.trim() === "plant") {
    const defaultValue = LocationList.find(item => item.choice === value.trim());
    const newChoice = CostCenterList.find(item => item.description === defaultValue?.description);
    correction.profitCenter = newChoice?.choice ?? null;
  }
  if (name.trim() === "materialType") {
    const defaultValue = MaterialTypeList.find(item => item.choice === value.trim());
    const newChoice = StorageLocList.find(item => item.description === defaultValue?.description);
    correction.storageLocation = newChoice?.choice ?? null;
  }
  return correction;
}


