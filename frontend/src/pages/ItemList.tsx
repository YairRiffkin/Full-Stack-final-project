// Displays the full item list with status and comments
import { useEffect, useState } from 'react';
import '../components/static/ItemListStyle.css'
import { ItemWithID } from '../models/itemtypes';
import { ItemListForm } from '../models/formtypes';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ItemListDetails } from '../components/pages/ItemListDisplayElements';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export type ModalProps = {
  onClose: () => void;
  text: string;
}

const Modal = ({ onClose, text }: ModalProps) => (
  <div className="modal">
    <div className="modal-content">
      <span className="close-button" onClick={onClose}>&times;</span>
      <p>{text}</p>
    </div>
  </div>
);

export function ItemList ({ userToken }: { userToken: string | null }) {
    const [itemDetails, setItemDetails] = useState<ItemWithID[] | null>(null);
    const [modalContent, setModalContent] = useState({ isOpen: false, text: '' });
    const itemListDetails: ItemListForm[] = ItemListDetails();

    const openModal = (commentText: string) => {
      setModalContent({ isOpen: true, text: commentText });
    };
    const closeModal = () => setModalContent({ isOpen: false, text: '' });

    useEffect(() => {
      fetch(BACKEND_URL + "/items/list", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer " + userToken
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
        })
      .then(data => {            
        if (data && data.item) {
          setItemDetails(data.item);
        }
      })
      .catch((error) => {
          alert("Error fetching pending data: " + error.message);
        });
      }, [userToken]);

      return (
        <div>
          {modalContent.isOpen && <Modal onClose={closeModal} text={modalContent.text} />}
          {itemDetails ? (
            <DataTable 
                      value={itemDetails} 
                      sortMode="multiple"
                      removableSort
                      scrollable 
                      scrollHeight="500px"
                      stripedRows 
                      showGridlines
                      tableStyle={{ minWidth: '50rem' }}
            >
              <Column 
                      key="id" 
                      field="id" 
                      header="ID" 
                      sortable
                      frozen 
                      style={{ width: '200px' }} 
              />
              <Column 
                      key="rem" 
                      field="rem" 
                      header="REM." 
                      sortable
                      frozen 
                      style={{ width: '200px' }} 
                      body={(rowData) => {
                        const commentText = rowData.rem;
                        return commentText ? (
                          <button className="rem-button" onClick={() => openModal(commentText)}>
                            Rem.
                          </button>
                        ) : null;
                      }}
              />
              <Column 
                      key="status" 
                      field="status" 
                      header="Status" 
                      sortable
                      frozen 
                      style={{ width: '200px' }} 
              />
                {itemListDetails.map((column, index) => (
                <Column 
                      key={index} 
                      field={column.name} 
                      header={column.placeholder.en}
                      sortable 
                      style={{ width: '25%' }}
                />

              ))}
            </DataTable>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      );
}

