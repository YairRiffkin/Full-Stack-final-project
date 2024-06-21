import { Dispatch, SetStateAction } from "react";
import { ItemFormDetail } from "../../models/formtypes";
import { Item } from "../../models/itemtypes";
import { User } from "../../models/usertypes";
import { CheckItemLine } from "../functions/ItemValidateFunctions";
import { DemoData } from "../static/DemoData";
import { CostCenterList, LocationList } from "./ItemFormDisplayElements";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export type ItemTrLeadColumnsProps = {
  itemDetail: ItemFormDetail;
}

export type ItemInputProps = { 
  itemDetail: ItemFormDetail;
  handleChange: (event: React.ChangeEvent<
                                        HTMLInputElement | 
                                        HTMLTextAreaElement
                                        >) => void;
  itemForm: Item;
}

export type ItemSelectProps = { 
  itemDetail: ItemFormDetail;
  handleChange: (event: React.ChangeEvent<
                                        HTMLInputElement | 
                                        HTMLTextAreaElement | 
                                        HTMLSelectElement 
                                        >) => void;
  userDetails: User | null;
  itemForm: Item;
  userLevel: string | null;
}

export type ButtonProps = { 
  itemComplete: boolean;
  setError: React.Dispatch<React.SetStateAction<string[] | null>>;
  itemForm: Item;
  userToken: string | null;
}

export function ItemTrHeader() {
  return (
    <thead>
      <tr>
        <th className="en-descr">ENGLISH DESCR.</th>
        <th className="heb-descr">HEBREW DESCR.</th>
        <th className="details">DETAILS</th>
        <th className="remarks">REMARKS</th>
      </tr>
    </thead>
  );
}

export function ItemTrLeadColumns( { itemDetail} : ItemTrLeadColumnsProps) {
  return (  <>
              <td className="en-descr">
                {itemDetail.placeholder.en}
              </td>
              <td className="heb-descr">
                {itemDetail.placeholder.heb}
              </td>
            </>
  );
}

export function ItemInputInput({ itemDetail, handleChange, itemForm }: ItemInputProps) {
  return (
    <input
      type= {itemDetail.type}
      name={itemDetail.name}
      maxLength={itemDetail.maxlength}
      value={itemForm[itemDetail.name as keyof Item] || ''}
      onChange={handleChange}
    />
  );
}

export function ItemTextAreaInput({ itemDetail, handleChange, itemForm }: ItemInputProps) {
  return (
    <textarea
      className="multiline-input"
      name={itemDetail.name}
      maxLength={itemDetail.maxlength}
      value={itemForm[itemDetail.name as keyof Item] || ''}
      onChange={handleChange}
    />
  );
}

export function ItemSelectInput({ itemDetail, handleChange, itemForm, userLevel }: ItemSelectProps) {
  return (
    <select 
      disabled= { (itemDetail.name === "plant" && userLevel !== "admin") ? true : false }
      name={itemDetail.name} 
      value={itemForm[itemDetail.name as keyof Item] || ''}
      onChange={(e) => handleChange(e)} 
    >
      {itemDetail.options?.map((option) => {
        return (
          <option key={option.choice} value={option.choice}>
           {option.description} - {option.choice}
          </option>
        );
      })}
    </select>
  );
}

export function ItemSubmitButton({ itemComplete, setError, itemForm, userToken }: ButtonProps) {
  return (
    <button type= "submit"
                      disabled={itemComplete}
                      onClick={(event) => {
                        event.preventDefault();
                        fetch(BACKEND_URL + "/items/new", {
                          method: "POST",
                          headers:  { 
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer " + userToken
                                    },
                          body: JSON.stringify(itemForm),
                          })
                          .then(response => response.json())
                          .then(data => { 
                            if (data.error) { setError(data.error) }
                            if (data.data) {
                              setError(null);
                            }
                          })
                          .catch((error) => alert("Error submitting item: " + error));
                      }}      
              >
                { itemComplete ? <span>Complete the form as requested</span> :<strong>SUBMIT</strong> }
              </button>
  )
}

export type DemoDataProps = { 
  setItemForm: (item: Item) => void;
  setWarnings: Dispatch<SetStateAction<string[]>>;
  }

export function DemoSelectItem( { setItemForm, setWarnings }: DemoDataProps) {
  return (<>
            <label style = {{ marginRight: "30px" }}
            >
              Select demo item number from 1 - 50": 
            </label>
            <input                 
                  style={{ maxWidth: '100px' }}
                  type= "number"
                  name= "demo item"
                  defaultValue={25}
                  placeholder= "demo item"
                  onChange= { (e) => {
                    const index = Number(e.target.value);
                    if (index >= 0 && index < DemoData.length) {
                      const demoItem = DemoData[index];
                      let userLocation: string | null;
                      const userData = localStorage.getItem("userData");
                      if (userData) {
                        userLocation = JSON.parse(userData)["location"];
                        const defaultPlant = LocationList.find( item =>
                          item.description === userLocation
                        );
                        const defaultCenter = CostCenterList.find( item =>
                          item.description === userLocation
                        );
                        demoItem.plant = defaultPlant?.choice ?? null
                        demoItem.profitCenter = defaultCenter?.choice ?? null
                      }
                      setItemForm(demoItem);
                      Object.keys(demoItem).forEach((key, keyindex) => {
                        const newWarning = CheckItemLine(String(key), String(demoItem[key as keyof Item]));
                        setWarnings((prevWarnings) => {
                          const updatedWarnings = [...prevWarnings];
                          updatedWarnings[keyindex - 1] = newWarning;
                          return updatedWarnings;
                        });
                      });
                  }}}
            /> 
          </>
  )
}