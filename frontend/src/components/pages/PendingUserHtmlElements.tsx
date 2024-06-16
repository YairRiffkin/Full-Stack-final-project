// Display HTML elements for pending users page

import { Dispatch, SetStateAction } from "react";
import { MyResponseContainerType } from "../../models/Responsetypes"
import { FormDetail } from "../../models/formtypes";
import { Item } from "../../models/itemtypes";
import { User } from "../../models/usertypes";
import { RegistrationFormDetails } from "./RegistrationDisplayElements";

export type TopDisplayProps = {
                              setSelectDisplay: Dispatch<SetStateAction<string>>,
                              setSelectLoc: Dispatch<SetStateAction<string>>,
                              setMaxItemNumber: Dispatch<SetStateAction<number | null>>,
                              maxItemNumber: number | null,
                              selectDisplay: string | null
                            }

export type DetailsProps = { 
                            pendingData: MyResponseContainerType | null, 
                            indexed: number 
                          }

export type DisplayTableProps = { 
                                  display: Item | User | null, 
                          }



export function UsersDisplay({pendingData, indexed}: DetailsProps ) {
  return (
    pendingData && pendingData[indexed] && (
      <table>
          <tbody>
              <tr>
                  <td>Index: {indexed} of {pendingData ? Object.keys(pendingData).length : 0}&nbsp;{"==>"}&nbsp;</td>
                  <td>Created on: {pendingData[indexed]?.created}&nbsp;{"==>"}&nbsp;</td>
                  <td>By: {pendingData[indexed]?.username}</td>
              </tr>
          </tbody>
      </table>
  )
  )}

export function UserDisplayTable ({ display }: DisplayTableProps) {
  const userFormDetails: FormDetail[] = RegistrationFormDetails;
  return (
    <table>
      <tbody>
      { display ? (
              userFormDetails?.map((userFormDetail, index) => (
                        <tr key={index}>
                            <td>{(userFormDetail.name !== "password1" && userFormDetail.name !== "password2") ?
                             userFormDetail.placeholder + ": " :
                             null}</td>
                            <td>{(display as User)[userFormDetail.name as keyof User]}</td>
                        </tr>
                    ))
                  ):(
                        <tr>
                            <td colSpan={ 2 }>No data to display.</td>
                        </tr>
            )}
        </tbody>
    </table>)}