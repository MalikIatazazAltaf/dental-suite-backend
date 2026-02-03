APIs:
Register: POST /api/auth/register
{
  "name": "Dr. Ahmad",
  "email": "owner2@clinic.com",
  "password": "123456",
  "clinic_name": "Ahmad Dental Clinic",
  "phone": "0300-1234567",
  "address": "Karachi",
  "timezone": "Asia/Karachi",
  "tax_enabled_default": true,
  "receipt_footer_note": "Thank you for visiting",
  "working_hours": {
    "mon_fri": "09:00-18:00",
    "sat": "10:00-14:00"
  }
}
Response:
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVhMmI1Y2EwLWU5ODctNDY1NC1hYTgwLWE3NGE4YmNkZGQxZiIsInJvbGUiOiJvd25lciIsImNsaW5pY19pZCI6ImU1NmJkMWFhLWEwZWUtNGNjMC1hZTYxLTI4NmU1NmRjNmQxZiIsImlhdCI6MTc2OTgzNzI0NCwiZXhwIjoxNzcwNDQyMDQ0fQ.H20CvdGWr9vjVGGe47Fc6xdNSqt77159cxqRis7xVOg",
    "user": {
        "id": "ea2b5ca0-e987-4654-aa80-a74a8bcddd1f",
        "name": "Dr. Ahmad",
        "role": "owner",
        "clinic_id": "6dcfa759-00f0-443f-9cd2-07dc09165797"
    }
}
Owner creating Users: 
POST /api/users
              Authorization: Bearer {{TOKEN_OWNER}}
{
  "name": "Dr. Ahmad",
  "email": "dentist@clinic.com",
  "password": "123456",
  "role": "dentist"
}
Response 
{
    "user": {
        "id": "8b277e22-7480-458a-bd54-283cad61f8c2",
        "name": "Dr. Ahmad",
        "role": "dentist",
        "clinic_id": "6dcfa759-00f0-443f-9cd2-07dc09165797"
    }
}

1️⃣ Login (to get token)

Endpoint: POST /api/auth/login

Body:

{
  "email": "owner@clinic.com",
  "password": "123456"
}


Response:

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....",
  "user": {
    "id": "<user_id>",
    "name": "Dr. Ali",
    "role": "owner",
    "clinic_id": "<clinic_id>"
  },
  "entitlements": {
    "plan": "trial",
    "can_export_pdf_receipt": false
  }
}
2️⃣ Me API

GET /api/auth/me

Headers:

Authorization: Bearer <token> //JWT token


Response:

{
  "user": {
        "id": "e738d9b3-2dcd-4a3c-bbb5-27b8566fa322",
        "name": "Dentist. Ahamd",
        "role": "dentist",
        "clinic_id": "5f9d158d-8769-42ca-a423-6cd4ca45f3f6"
    },
    "clinic": {
        "_id": "5f9d158d-8769-42ca-a423-6cd4ca45f3f6",
        "is_deleted": false,
        "name": "Ahamd Dental Clinic",
        "phone": "0300-1234567",
        "address": "Lahore",
        "logo_url": "https://example.com/logo.png",
        "timezone": "Asia/Karachi",
        "tax_enabled_default": true,
        "receipt_footer_note": "Thank you for visiting!",
        "working_hours": {
            "mon_fri": "09:00-18:00",
            "sat": "10:00-14:00"
        },
        "created_at": "2026-01-29T07:19:19.887Z",
        "updated_at": "2026-01-29T07:19:19.887Z",
        "__v": 0
    },
    "entitlements": {
        "plan": "trial",
        "can_export_pdf_receipt": true
    }
}

3️⃣ Patients APIs
3.1 Create Patient

POST /api/patients

{
  "name": "Mr John Doe",
  "phone": "+1-555-1234567",
  "email": "johndoe@example.com",
  "notes_light": "Regular checkup"
}


Response: Patient object with _id
{
    "clinic_id": "5f9d158d-8769-42ca-a423-6cd4ca45f3f6",
    "created_by": "d90dc8ce-9797-4c39-8cc6-8f3d6eb4baff",
    "is_deleted": false,
    "name": "Mr John Doe",
    "phone": "+1-555-1234567",
    "email": "johndoe@example.com",
    "notes_light": "Regular checkup",
    "_id": "56abe3d5-548c-4585-ac5d-fc14206ce6c0",
    "created_at": "2026-01-29T10:05:37.727Z",
    "updated_at": "2026-01-29T10:05:37.727Z",
    "__v": 0
}
3.2 Get Patient

GET /api/patients/:id → use patient _id from create response

Response: patient + recent_appointments + recent_invoices
{
    "patient": {
        "_id": "56abe3d5-548c-4585-ac5d-fc14206ce6c0",
        "clinic_id": "5f9d158d-8769-42ca-a423-6cd4ca45f3f6",
        "created_by": "d90dc8ce-9797-4c39-8cc6-8f3d6eb4baff",
        "is_deleted": false,
        "name": "Mr John Doe",
        "phone": "+1-555-1234567",
        "email": "johndoe@example.com",
        "notes_light": "Regular checkup",
        "created_at": "2026-01-29T10:05:37.727Z",
        "updated_at": "2026-01-29T10:05:37.727Z",
        "__v": 0
    },
    "recent_appointments": [],
    "recent_invoices": []
}
3.3 Get All Patients
GET /api/patients?search=&page=1&limit=20
Response:
 {
    "patients": [
        {
            "_id": "edea9bce-3c32-4462-8f0a-b53655b2beb5",
            "clinic_id": "5f9d158d-8769-42ca-a423-6cd4ca45f3f6",
            "created_by": "d90dc8ce-9797-4c39-8cc6-8f3d6eb4baff",
            "is_deleted": false,
            "name": "Ahmad",
            "phone": "+1-555-1234567",
            "email": "Ahmad@example.com",
            "notes_light": "Tooth filling",
            "created_at": "2026-01-29T10:01:58.256Z",
            "updated_at": "2026-01-29T10:01:58.256Z",
            "__v": 0
        },
        {
            "_id": "56abe3d5-548c-4585-ac5d-fc14206ce6c0",
            "clinic_id": "5f9d158d-8769-42ca-a423-6cd4ca45f3f6",
            "created_by": "d90dc8ce-9797-4c39-8cc6-8f3d6eb4baff",
            "is_deleted": false,
            "name": "Mr John Doe",
            "phone": "+1-555-1234567",
            "email": "johndoe@example.com",
            "notes_light": "Regular checkup",
            "created_at": "2026-01-29T10:05:37.727Z",
            "updated_at": "2026-01-29T10:05:37.727Z",
            "__v": 0
        }
    ]
}

4️⃣ Services APIs
4.1 Create Service

POST /api/services

{
  "name": "Tooth Filling",
  "default_fee": 1200,
  "default_duration_minutes": 30,
  "is_active": true
}
Response:
{
    "clinic_id": "5f9d158d-8769-42ca-a423-6cd4ca45f3f6",
    "created_by": "d90dc8ce-9797-4c39-8cc6-8f3d6eb4baff",
    "is_deleted": false,
    "name": "Tooth Filling",
    "default_fee": 1200,
    "default_duration_minutes": 30,
    "is_active": true,
    "_id": "8bebdc88-2d74-422e-ae3a-19611da5a522",
    "created_at": "2026-01-29T10:24:07.690Z",
    "updated_at": "2026-01-29T10:24:07.690Z",
    "__v": 0
}
4.2 List Services

GET /api/services → should show created services
Response:
{
    "services": [
        {
            "_id": "19ed500f-1f61-4c22-8784-6be483c62bd9",
            "clinic_id": "5f9d158d-8769-42ca-a423-6cd4ca45f3f6",
            "created_by": "d90dc8ce-9797-4c39-8cc6-8f3d6eb4baff",
            "is_deleted": false,
            "name": "Tooth Filling",
            "default_fee": 1200,
            "default_duration_minutes": 30,
            "is_active": true,
            "created_at": "2026-01-29T10:22:09.490Z",
            "updated_at": "2026-01-29T10:22:09.490Z",
            "__v": 0
        },
        {
            "_id": "8bebdc88-2d74-422e-ae3a-19611da5a522",
            "clinic_id": "5f9d158d-8769-42ca-a423-6cd4ca45f3f6",
            "created_by": "d90dc8ce-9797-4c39-8cc6-8f3d6eb4baff",
            "is_deleted": false,
            "name": "Tooth Filling",
            "default_fee": 1200,
            "default_duration_minutes": 30,
            "is_active": true,
            "created_at": "2026-01-29T10:24:07.690Z",
            "updated_at": "2026-01-29T10:24:07.690Z",
            "__v": 0
        }
    ]
}

5️⃣ Appointments APIs
5.1 Create Appointment

POST /api/appointments

{
  "patient_id": "<patient_id>",
  "dentist_id": "<user_id>",
  "service_id": "<service_id>",
  "start_at": "2026-01-27T10:00:00",
  "duration_minutes": 30,
  "fee_snapshot": 120,
  "status": "booked",
  "source": "scheduled"
}
Response:
{
    "clinic_id": "c582e87e-bd78-43ba-aaff-bed9924f5f96",
    "is_deleted": false,
    "patient_id": "ed8e47c2-f762-441d-a459-20ae086cf642",
    "dentist_id": "7ce08e87-a5c0-474a-b70e-48d5e58bfb40",
    "service_id": "dd93b62a-14c2-4996-b45e-e43a91b2c815",
    "start_at": "2026-01-27T05:00:00.000Z",
    "end_at": "2026-01-27T05:30:00.000Z",
    "fee_snapshot": 120,
    "status": "booked",
    "source": "scheduled",
    "_id": "15c0ec19-1fe2-49a1-a518-af3df8e2d15b",
    "created_at": "2026-01-30T06:22:50.643Z",
    "updated_at": "2026-01-30T06:22:50.643Z",
    "__v": 0
}
5.2 Create Walkins:
POST  /api/appointments/walkins 
{
  "patient_id": "ed8e47c2-f762-441d-a459-20ae086cf642",
  "dentist_id": "7ce08e87-a5c0-474a-b70e-48d5e58bfb40",
  "service_id": "dd93b62a-14c2-4996-b45e-e43a91b2c815",
  "fee_snapshot": 120
}
Response:
{
    "appointment_id": "2867e4cb-e527-4681-a1d1-5a39be8f5b29",
    "token_number": "W-001"
}
5.3 List Appointments

GET /api/appointments?date=2026-01-30 → should return appointments + walkins
Response:
{
    "appointments": [
        {
            "_id": "52397725-b0f3-4e98-952c-4a0e4a2ad9a8",
            "clinic_id": "c582e87e-bd78-43ba-aaff-bed9924f5f96",
            "is_deleted": false,
            "patient_id": "ed8e47c2-f762-441d-a459-20ae086cf642",
            "dentist_id": "7ce08e87-a5c0-474a-b70e-48d5e58bfb40",
            "service_id": "dd93b62a-14c2-4996-b45e-e43a91b2c815",
            "start_at": "2026-01-30T05:00:00.000Z",
            "end_at": "2026-01-30T05:30:00.000Z",
            "fee_snapshot": 120,
            "status": "booked",
            "source": "scheduled",
            "created_at": "2026-01-30T05:52:25.599Z",
            "updated_at": "2026-01-30T05:52:25.599Z",
            "__v": 0
        },
        {
            "_id": "4543aad0-51ee-4ea9-a0d2-9b3b705d269c",
            "clinic_id": "c582e87e-bd78-43ba-aaff-bed9924f5f96",
            "is_deleted": false,
            "patient_id": "ed8e47c2-f762-441d-a459-20ae086cf642",
            "dentist_id": "4c8200aa-7ede-4489-a689-ded3e29bcfff",
            "service_id": "dd93b62a-14c2-4996-b45e-e43a91b2c815",
            "start_at": "2026-01-30T05:00:00.000Z",
            "end_at": "2026-01-30T05:30:00.000Z",
            "fee_snapshot": 120,
            "status": "booked",
            "source": "scheduled",
            "created_at": "2026-01-30T05:56:11.706Z",
            "updated_at": "2026-01-30T05:56:11.706Z",
            "__v": 0
        },
        {
            "_id": "ecc58eb4-2827-4112-b9b5-7198c442232f",
            "clinic_id": "c582e87e-bd78-43ba-aaff-bed9924f5f96",
            "is_deleted": false,
            "patient_id": "ed8e47c2-f762-441d-a459-20ae086cf642",
            "dentist_id": "4c8200aa-7ede-4489-a689-ded3e29bcfff",
            "service_id": "dd93b62a-14c2-4996-b45e-e43a91b2c815",
            "start_at": "2026-01-30T05:00:00.000Z",
            "end_at": "2026-01-30T05:30:00.000Z",
            "fee_snapshot": 120,
            "status": "booked",
            "source": "scheduled",
            "created_at": "2026-01-30T05:56:49.384Z",
            "updated_at": "2026-01-30T05:56:49.384Z",
            "__v": 0
        }
    ],
    "walkins": [
        {
            "_id": "2867e4cb-e527-4681-a1d1-5a39be8f5b29",
            "clinic_id": "c582e87e-bd78-43ba-aaff-bed9924f5f96",
            "created_by": "7ce08e87-a5c0-474a-b70e-48d5e58bfb40",
            "is_deleted": false,
            "patient_id": "ed8e47c2-f762-441d-a459-20ae086cf642",
            "dentist_id": "7ce08e87-a5c0-474a-b70e-48d5e58bfb40",
            "service_id": "dd93b62a-14c2-4996-b45e-e43a91b2c815",
            "start_at": "2026-01-30T07:41:00.723Z",
            "end_at": "2026-01-30T08:11:00.723Z",
            "fee_snapshot": 120,
            "status": "booked",
            "source": "walk_in",
            "token_number": "W-001",
            "created_at": "2026-01-30T07:41:00.727Z",
            "updated_at": "2026-01-30T07:41:00.727Z",
            "__v": 0
        }
    ]
}
5.4 Update Status

PATCH /api/appointments/:id/status

{ "status": "arrived" }
Response:
{
    "_id": "449423b3-0087-47e5-876e-873949d81415",
    "clinic_id": "5f9d158d-8769-42ca-a423-6cd4ca45f3f6",
    "is_deleted": false,
    "patient_id": "56abe3d5-548c-4585-ac5d-fc14206ce6c0",
    "dentist_id": "e738d9b3-2dcd-4a3c-bbb5-27b8566fa322",
    "service_id": "19ed500f-1f61-4c22-8784-6be483c62bd9",
    "start_at": "2026-01-30T05:00:00.000Z",
    "end_at": "2026-01-30T05:30:00.000Z",
    "fee_snapshot": 120,
    "status": "arrived",
    "source": "scheduled",
    "created_at": "2026-01-30T09:35:16.306Z",
    "updated_at": "2026-01-30T09:35:16.306Z",
    "__v": 0
}
6️⃣ Invoices & Payments
6.1 Create Invoice

POST /api/invoices

{
  "patient_id": "<patient_id>",
  "appointment_id": "<appointment_id>",
  "discount_type": "percent",
  "discount_value": 10,
  "tax_enabled": false,
  "items": [
    { "service_id": "<service_id>", "description": "Scaling", "qty": 1, "unit_price": 120 }
  ],
  "notes": "Follow-up next month"
}
Response
{
    "invoice": {
        "clinic_id": "c582e87e-bd78-43ba-aaff-bed9924f5f96",
        "created_by": "a3b9d768-4266-4719-ae71-7e1310dd067a",
        "is_deleted": false,
        "invoice_number": "INV-000007",
        "patient_id": "ed8e47c2-f762-441d-a459-20ae086cf642",
        "appointment_id": "14833bcb-f75c-4cb6-af5c-e73565699c04",
        "subtotal": 120,
        "discount_amount": 12,
        "tax_amount": 0,
        "total": 108,
        "total_paid": 0,
        "balance_due": 108,
        "status": "unpaid",
        "notes": "Follow-up next month",
        "_id": "a4a05fb9-4a65-4ea0-bf27-dee9984162a0",
        "created_at": "2026-01-30T10:36:51.212Z",
        "updated_at": "2026-01-30T10:36:51.212Z",
        "__v": 0
    }
}
6.2 Create Payment
POST /api/payments

{
  "invoice_id": "<invoice_id>",
  "amount": 60,
  "method": "cash",
  "paid_at": "2026-01-27T12:10:00",
  "note": "Partial payment"
}
Response
{
    "payment": {
        "clinic_id": "c582e87e-bd78-43ba-aaff-bed9924f5f96",
        "created_by": "a3b9d768-4266-4719-ae71-7e1310dd067a",
        "is_deleted": false,
        "invoice_id": "33520e3c-5cc9-4bb5-9846-f375d88c08ad",
        "amount": 54,
        "method": "cash",
        "paid_at": "2026-01-27T07:10:00.000Z",
        "note": "Partial payment",
        "_id": "5418d46a-f18c-41bd-aa39-887707f197c8",
        "created_at": "2026-01-30T10:43:02.433Z",
        "updated_at": "2026-01-30T10:43:02.433Z",
        "__v": 0
    }
}
6.3 List Invoices

GET /api/invoices?from=2026-01-01&to=2026-01-31&status=unpaid
Response
{
    "invoices": [
        {
            "_id": "a4a05fb9-4a65-4ea0-bf27-dee9984162a0",
            "clinic_id": "c582e87e-bd78-43ba-aaff-bed9924f5f96",
            "created_by": "a3b9d768-4266-4719-ae71-7e1310dd067a",
            "is_deleted": false,
            "invoice_number": "INV-000007",
            "patient_id": "ed8e47c2-f762-441d-a459-20ae086cf642",
            "appointment_id": "14833bcb-f75c-4cb6-af5c-e73565699c04",
            "subtotal": 120,
            "discount_amount": 12,
            "tax_amount": 0,
            "total": 108,
            "total_paid": 0,
            "balance_due": 108,
            "status": "unpaid",
            "notes": "Follow-up next month",
            "created_at": "2026-01-30T10:36:51.212Z",
            "updated_at": "2026-01-30T10:36:51.212Z",
            "__v": 0
        },
        {
            "_id": "83c2d445-ff3b-471b-a2bc-fdf89ed96738",
            "clinic_id": "c582e87e-bd78-43ba-aaff-bed9924f5f96",
            "created_by": "a3b9d768-4266-4719-ae71-7e1310dd067a",
            "is_deleted": false,
            "invoice_number": "INV-000006",
            "patient_id": "ed8e47c2-f762-441d-a459-20ae086cf642",
            "appointment_id": "14833bcb-f75c-4cb6-af5c-e73565699c04",
            "subtotal": 120,
            "discount_amount": 12,
            "tax_amount": 0,
            "total": 108,
            "total_paid": 0,
            "balance_due": 108,
            "status": "unpaid",
            "notes": "Follow-up next month",
            "created_at": "2026-01-30T10:36:16.890Z",
            "updated_at": "2026-01-30T10:36:16.890Z",
            "__v": 0
        },
        {
            "_id": "52594435-ec20-4498-bd7a-ce64ade94942",
            "clinic_id": "c582e87e-bd78-43ba-aaff-bed9924f5f96",
            "created_by": "a3b9d768-4266-4719-ae71-7e1310dd067a",
            "is_deleted": false,
            "invoice_number": "INV-000005",
            "patient_id": "ed8e47c2-f762-441d-a459-20ae086cf642",
            "appointment_id": "14833bcb-f75c-4cb6-af5c-e73565699c04",
            "subtotal": 120,
            "discount_amount": 12,
            "tax_amount": 0,
            "total": 108,
            "total_paid": 0,
            "balance_due": 108,
            "status": "unpaid",
            "notes": "Follow-up next month",
            "created_at": "2026-01-30T10:36:16.033Z",
            "updated_at": "2026-01-30T10:36:16.033Z",
            "__v": 0
        }
    ]
}
7️⃣ Reports
7.1 Daily Report

GET /api/reports/daily?date=2026-01-27
7.2 Monthly Report

GET /api/reports/monthly?month=2026-01