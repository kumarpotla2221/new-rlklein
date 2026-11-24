<?php
declare(strict_types=1);

namespace RLK\Controllers;

use RLK\Database;
use RLK\Logger;
use RLK\Mailer;
use RLK\RateLimiter;
use RLK\Request;

/** The Contact page and the Facility Staffing Request form. */
final class FormsController
{
    /** POST ?action=submitContact */
    public static function contact(Request $request): array
    {
        if ($request->isBot()) {
            Logger::info('Honeypot: contact form ignored', ['ip' => $request->ip]);
            return ['received' => true];
        }
        RateLimiter::hit('submitContact', $request->ip);

        $in = $request->input();
        $row = [
            'first_name' => $in->string('firstName', 'First name', 80, true),
            'last_name' => $in->string('lastName', 'Last name', 80, true),
            'email' => $in->email('email', 'email address', true),
            'phone' => $in->phone('phone', 'phone number', true),
            'profession' => $in->string('profession', 'Profession', 120),
            'specialty' => $in->string('specialty', 'Specialty', 120),
            'experience' => $in->string('experience', 'Experience', 40),
            'start_time' => $in->string('startTime', 'Start time', 40),
            'email_consent' => $in->bool('emailConsent') ? 1 : 0,
            'sms_consent' => $in->bool('smsConsent') ? 1 : 0,
            'message' => $in->text('message', 'Message', 5000),
            'ip_address' => $request->ip,
            'user_agent' => $request->userAgent,
            'created_at' => Database::now(),
        ];
        $id = Database::insert('contact_submissions', $row);

        Mailer::notifyTeam(
            "Website contact: {$row['first_name']} {$row['last_name']}" . ($row['profession'] ? " ({$row['profession']})" : ''),
            'A healthcare professional asked to talk to a recruiter.',
            [
                'Name' => "{$row['first_name']} {$row['last_name']}",
                'Email' => $row['email'],
                'Phone' => $row['phone'],
                'Profession' => $row['profession'],
                'Specialty' => $row['specialty'],
                'Experience' => $row['experience'],
                'Can start' => $row['start_time'],
                'OK to email' => $row['email_consent'] ? 'Yes' : 'No',
                'OK to text' => $row['sms_consent'] ? 'Yes' : 'No',
                'Message' => $row['message'],
            ],
            $row['email']
        );

        return ['id' => $id, 'received' => true];
    }

    /** POST ?action=submitStaffingRequest */
    public static function staffingRequest(Request $request): array
    {
        if ($request->isBot()) {
            Logger::info('Honeypot: staffing request ignored', ['ip' => $request->ip]);
            return ['received' => true];
        }
        RateLimiter::hit('submitStaffingRequest', $request->ip);

        $in = $request->input();
        $row = [
            'first_name' => $in->string('firstName', 'First name', 80, true),
            'last_name' => $in->string('lastName', 'Last name', 80, true),
            'title' => $in->string('title', 'Professional title', 120, true),
            'email' => $in->email('email', 'email address', true),
            'phone' => $in->phone('phone', 'phone number', true),
            'organization' => $in->string('organization', 'Facility or organization name', 200, true),
            'city' => $in->string('city', 'City', 120),
            'state' => $in->string('state', 'State', 60),
            'facility_type' => $in->string('facilityType', 'Facility type', 120),
            'profession_needed' => $in->string('professionNeeded', 'Profession needed', 120, true),
            'number_needed' => $in->int('numberNeeded', 'Number needed', 1, 1000) ?? 1,
            'assignment_type' => $in->string('assignmentType', 'Assignment type', 60),
            'shift' => $in->string('shift', 'Shift', 40),
            'start_date' => $in->date('startDate', 'Start date'),
            'details' => $in->text('details', 'Details', 5000),
            'has_existing_agency' => $in->bool('hasExistingAgency') ? 1 : 0,
            'improvement_goals' => $in->text('improvementGoals', 'Improvement goals', 5000),
            'ip_address' => $request->ip,
            'user_agent' => $request->userAgent,
            'created_at' => Database::now(),
        ];
        $id = Database::insert('staffing_requests', $row);

        Mailer::notifyTeam(
            "Staffing request: {$row['organization']}: {$row['number_needed']} × {$row['profession_needed']}",
            'A facility submitted a staffing request on the website.',
            [
                'Organization' => $row['organization'],
                'Facility type' => $row['facility_type'],
                'Location' => trim(($row['city'] ?? '') . ', ' . ($row['state'] ?? ''), ', '),
                'Contact' => "{$row['first_name']} {$row['last_name']}, {$row['title']}",
                'Email' => $row['email'],
                'Phone' => $row['phone'],
                'Profession needed' => $row['profession_needed'],
                'Number needed' => $row['number_needed'],
                'Assignment type' => $row['assignment_type'],
                'Shift' => $row['shift'],
                'Start date' => $row['start_date'],
                'Uses another agency' => $row['has_existing_agency'] ? 'Yes' : 'No',
                'Details' => $row['details'],
                'Improvement goals' => $row['improvement_goals'],
            ],
            $row['email']
        );

        return ['id' => $id, 'received' => true];
    }
}
