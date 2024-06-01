import { useEffect, useState } from "react";
import '../components/static/itemstyle.css'
import { ItemFormDetail } from "../models/formtypes";
import { User } from "../models/usertypes";
import { ItemFormDetails } from "../components/pages/ItemFormDisplayElements";
import { Item, initializeItem } from "../models/itemtypes";
import { CheckItemComplete, CheckItemLine, DefaultDisplay, ItemDefaultWarning, ItemIssues, ItemWarningDisplay } from "../components/functions/ItemValidateFunctions";
import { DemoSelectItem, ItemInputInput, ItemSelectInput, ItemSubmitButton, ItemTextAreaInput, ItemTrHeader, ItemTrLeadColumns } from "../components/pages/ItemFormHtmlElements";

export type UserDataProps = { 
    userDetails: User | null;
    userToken: string | null;
    }

export function NewItemLog({ userDetails, userToken }: UserDataProps) {
  const itemFormDetails: ItemFormDetail[] = ItemFormDetails;
  const [itemForm, setItemForm] = useState<Item>(() => initializeItem());
  const [warnings, setWarnings] = useState<(string)[]>(ItemDefaultWarning());
  const [error, setError] = useState<string[] | null>(null)
  const [itemComplete, setItemComplete] = useState<boolean>(true);

  

  useEffect(() => {
    setItemComplete(CheckItemComplete( warnings));    
  }, [error, itemForm, userDetails, warnings]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const index = itemFormDetails.findIndex((detail) => detail.name === e.target.name);
    const newWarning = CheckItemLine(String(e.target.name),
                                    String(e.target.value));
    
    const defaultDisplay = DefaultDisplay(String(e.target.name), String(e.target.value));
    const newKey = Object.keys(defaultDisplay)[0] as keyof typeof defaultDisplay;
    const newValue = defaultDisplay[newKey];
    (itemForm as any)[newKey] = newValue;
    console.log("default display: ", defaultDisplay)
    
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

  return  <form className="item-box">
            { (error) ? ItemIssues(error) : null }
              <table className="item-table">
                <ItemTrHeader />
                <tbody>
                {itemFormDetails.map(( itemDetail, index ) => {
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
                            userLevel=  { userDetails?.user_level ?? null}
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
                userToken = { userToken }
              />
              <DemoSelectItem setItemForm = { setItemForm } setWarnings = { setWarnings }/>
          </form>;
    
}


