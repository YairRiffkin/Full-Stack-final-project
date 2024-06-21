My Final Project

**Short Description:**

This app is intended for registering new technical spare parts into the company ERP database.

The company standard defines what details should be submitted and in which format, and what needs to be included in the final registration form.

It has 3 main processes:

-   Users:
    -   Registration
    -   Approval (defining user level in the process)
    -   Editing details (by user) or changing user level status (by administrator)
-   Items:
    -   Registration
    -   Approval in 2 stages – 1) By administrator to verify that details have been submitted correctly, 2) By procurement to verify compliance to procurement standard.
-   Final application:
    -   Creates a submission form in a predefined standard format.

**General:**

As I wanted to do something a bit different and challenging for this final project, together with having something that might be practical, I decided on this APP which fulfills a challenge I faced at work.

The main challenges I faced, apart from writing full stack code for the first time in my life, were:

1.  Finding solutions for specific designs I thought were needed for the end user.
2.  Large format inputs for the item details. These include in the most basic version 31 details.
3.  Creating default dependencies for user friendliness and standard compliance.
4.  The biggest challenge right at the start was to create a fixed, 1-fits-all navbar that adapts to user level on login.

**Functionality:**

| PROCESS | STAGE        | REQUIREMENTS                                                                                                                                                                                                                                                                                                                                                                           | AUTHORIZATION         |
|---------|--------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|
| User    | Registration | Any user can only be a company employee. Therefore, identifying details that cannot be changed or used with other users are an employee ID number and a valid company email.                                                                                                                                                                                                           | Any employee          |
|         | Approval     | Admin will approve or not a registered user and designation 1 of 4 user levels: Admin User – allowed to register new items but only to his workplace location. Proc – procurement user that can only approve items but not introduce new ones. Guest – has only the possibility to view the existing item list.                                                                        | Admin                 |
|         | Update       | Every user can update his details or password. Employee ID and email cannot be changed.                                                                                                                                                                                                                                                                                                | Any user              |
|         | User Level   | Administrator is allowed to change user level status at any time.                                                                                                                                                                                                                                                                                                                      | Admin                 |
| Item    | Registration | A new item can be submitted by any “user” level user. There are required fields and optional fields. Leading detail for duplication validation is manufacturer part number which is unique globally. Item type defines storage location. Location defines cost center definition Only administrator can open an item for any location. Users can only submit items for their location. | Any “user” level user |
|         | Approval     | Administrator can review the submission form and: Approve – giving the item a unique SKU number. Dismiss – administrator has an option to add a comment for why the item has not been approved. This comment can be seen by the user when viewing the items list.                                                                                                                      | Admin                 |
|         | Procurement  | “proc” level user can see the pending items with details relevant to him/her and approve or dismiss with a comment as above.                                                                                                                                                                                                                                                           | Proc                  |
|         | Final        | When the item has been approved by procurement the administrator can choose which items to send for entry to the ERP data base by the Masterdata dep.                                                                                                                                                                                                                                  | Admin                 |

Log Data:

All actions performed are logged in a “history” table for reference and troubleshooting.

For items:

|      | Action          | Status    | Next  |
|------|-----------------|-----------|-------|
| User | register        | pending   | admin |
|      | approved        | active    | -     |
|      | update          | unchanged | -     |
|      | login           | unchanged | -     |
|      | Password update | unchanged | -     |
| Item | register        | pending   | admin |
|      | approved        | proc      | proc  |
|      | approved        | final     | admin |

Demo Data:

To ease demonstration of the application, I have introduced 2 features:

1.  Basic data to start with.
    1.  When entering the app. You can run backend\\dbDemo.py
