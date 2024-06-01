import { Dispatch, SetStateAction } from "react";
import { MyResponseContainerType } from "../../models/Responsetypes"
import { ItemFormDetail } from "../../models/formtypes";
import { Item } from "../../models/itemtypes";
import { CostCenterList, ItemFormDetails } from "./ItemFormDisplayElements";

export type TopDisplayProps = {
                              setSelectLoc: Dispatch<SetStateAction<string>>,
                              setMaxItemNumber: Dispatch<SetStateAction<number | null>>,
                              maxItemNumber: number | null
                            }

export type DetailsProps = { 
                            pendingData: MyResponseContainerType | null, 
                            indexed: number 
                          }

export type DisplayTableProps = { 
                                  display: Item | null, 
                          }

export function TopDisplay({setSelectLoc, setMaxItemNumber, maxItemNumber}: TopDisplayProps) {
  return (
    <div className="top-box">
              <>
                <select 
                  name="selectLoc"
                  onChange={(e) => { setSelectLoc(e.target.value); }}
                >
                  {CostCenterList?.map((option) => {
                    return (
                      <option key={option.choice} value={option.choice}>
                        {option.description} - {option.choice}
                      </option>
                    );
                  })}
                </select>
                <input  name="maxSKU"
                        type="number"
                        value={ maxItemNumber|| 0 }
                        onChange={(e) => { setMaxItemNumber(parseInt(e.target.value, 10)); }}
                />
              </> 
          </div>
        )
}

export function DetailsDisplay({pendingData, indexed}: DetailsProps ) {
  return (
    pendingData && pendingData[indexed] && (
      <table>
          <tbody>
              <tr>
                  <td>Index: {indexed} of {pendingData ? Object.keys(pendingData).length : 0}</td>
                  <td>Created on: {pendingData[indexed]?.created}</td>
                  <td>By: {pendingData[indexed]?.username}</td>
                  <td>Id: {pendingData[indexed]?.relative}</td>
              </tr>
          </tbody>
      </table>
  )
  )}

  export function ItemDisplayTable ({ display }: DisplayTableProps) {
    const itemFormDetails: ItemFormDetail[] = ItemFormDetails;
    return (
      <table>
        <tbody>
            { display ? (
              itemFormDetails?.map((itemFormDetail, index) => (
                        <tr key={index}>
                            <td>{itemFormDetail.placeholder.heb}: </td>
                            <td>{(display as Item)[itemFormDetail.name as keyof Item]}</td>
                        </tr>
                    ))
                  ):(
                        <tr>
                            <td colSpan={ 2 }>No data to display.</td>
                        </tr>
            )}
        </tbody>
    </table>)}
