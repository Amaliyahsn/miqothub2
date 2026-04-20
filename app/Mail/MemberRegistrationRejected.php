<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MemberRegistrationRejected extends Mailable
{
    use Queueable, SerializesModels;

    public $member;
    public $courseNames;

    /**
     * Create a new message instance.
     */
    public function __construct(User $member, $courseNames)
    {
        $this->member = $member;
        $this->courseNames = $courseNames;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Update Status Pendaftaran - ' . config('app.name'))
                    ->markdown('emails.member.registration_rejected');
    }
}