import { useEffect, useState } from "react";
import '../components/static/itemstyle.css'
import { ItemFormDetail } from "../models/formtypes";
import { User } from "../models/usertypes";
import { ItemFormDetails } from "../components/pages/ItemFormDisplayElements";
import { Item, initializeItem } from "../models/itemtypes";
import { CheckItemComplete, CheckItemLine, ItemDefaultWarning, ItemIssues, ItemWarningDisplay } from "../components/functions/ItemValidateFunctions";
import { ItemInputInput, ItemSelectInput, ItemSubmitButton, ItemTextAreaInput, ItemTrHeader, ItemTrLeadColumns } from "../components/pages/ItemFormHtmlElements";

export type UserDataProps = { 
    userDetails: User | null;
    userToken: string | null;
    }

export function NewItemLog({ userDetails }: UserDataProps) {
  const itemFormDetails: ItemFormDetail[] = ItemFormDetails;
  const [itemForm, setItemForm] = useState<Item>(() => initializeItem());
  const [warnings, setWarnings] = useState<(string)[]>(ItemDefaultWarning());
  const [error, setError] = useState<string[] | null>(null)
  const [itemComplete, setItemComplete] = useState<boolean>(true);

  

  useEffect(() => {
    setItemComplete(CheckItemComplete(itemForm, warnings));
    
  }, [error, itemForm, userDetails, warnings]);
  
  // console.log("item userdetails ", userDetails);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    console.log("e.name: ", e.target.name, e.target.value);
    const index = itemFormDetails.findIndex((detail) => detail.name === e.target.name);
    const newWarning = CheckItemLine(String(e.target.name),
                                    String(e.target.value));
    
    setWarnings((prevWarnings) => {
      const updatedWarnings = [...prevWarnings];
      updatedWarnings[index] = newWarning;
      return updatedWarnings;
    });
    
      const { name, value } = e.target;
      setItemForm((prevData) => ({
        ...prevData,
        [name]: value,
      }));
  };

  // console.log("form: ", itemForm); 
  // console.log("main app warnings: ", warnings)

  return  <form className="form-box">
            { (error) ? ItemIssues(error) : null }
              <table className="item-table">
                <ItemTrHeader />
                <tbody>
                {itemFormDetails.map(( itemDetail, index ) => {
                  // console.log("Index:", index, "index warning: ", warnings[index], typeof(warnings[index]));
                  return (
                  <tr key={index}>
                    < ItemTrLeadColumns itemDetail = { itemDetail } />
                      <td className="details">
                        {itemDetail.element === "input" && (
                          <ItemInputInput
                            itemDetail={itemDetail}
                            handleChange={handleChange}
                            itemForm= { itemForm }
                          />
                        )}
                        {itemDetail.element === "textarea" && (
                          <ItemTextAreaInput
                            itemDetail={itemDetail}
                            handleChange={handleChange}
                            itemForm= { itemForm }
                          />
                        )} 
                        {itemDetail.element === "select" && (
                          <ItemSelectInput
                            itemDetail={itemDetail}
                            handleChange={handleChange}
                            userDetails = {userDetails}
                            itemForm = {itemForm}
                          />
                        )}
                      </td>
                      <td className="remarks">
                        {warnings[index] && ItemWarningDisplay(warnings[index])}
                      </td>
                  </tr>
                  );
})}
                </tbody>
              </table>
              <ItemSubmitButton
                itemComplete = {itemComplete}
                setError = { setError }
                itemForm = { itemForm }
              />
          </form>;
    
}


