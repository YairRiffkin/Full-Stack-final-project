import { Dispatch, SetStateAction } from "react";
import { MyResponseContainerType } from "../../models/Responsetypes"
import { ItemFormDetail, ProcurementFormDetail } from "../../models/formtypes";
import { Item } from "../../models/itemtypes";
import { CostCenterList, ItemFormDetails } from "./ItemFormDisplayElements";
import { ProcurementFormDetails } from "./ProcurementDisplayElements";


export type DetailsProps = { 
                            pendingData: MyResponseContainerType | null, 
                            indexed: number 
                          }

export type DisplayTableProps = { 
                                  display: Item | null, 
                          }

export function ProcDetailsDisplay({pendingData, indexed}: DetailsProps ) {
  return (
    pendingData && pendingData[indexed] && (
      <table>
          <tbody>
              <tr>
                  <td>Index: {indexed} of {pendingData ? Object.keys(pendingData).length : 0}</td>
                  <td>Approved on: {pendingData[indexed]?.created}</td>
                  <td>By: {pendingData[indexed]?.username}</td>
                  <td>item Id: {pendingData[indexed]?.relative}</td>
              </tr>
          </tbody>
      </table>
  )
  )}

  export function ProcDisplayTable ({ display }: DisplayTableProps) {
    const procFormDetails: ProcurementFormDetail[] = ProcurementFormDetails;
    return (
      <table>
        <tbody>
            { display ? (
              procFormDetails?.map((procFormDetail, index) => (
                        <tr key={index}>
                            <td>{procFormDetail.placeholder.heb}: </td>
                            <td>{(display as Item)[procFormDetail.name as keyof Item]}</td>
                        </tr>
                    ))
                  ):(
                        <tr>
                            <td colSpan={ 2 }>No data to display.</td>
                        </tr>
            )}
        </tbody>
    </table>)}
