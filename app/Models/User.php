<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
// Import class untuk Reset Password
use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
use Illuminate\Notifications\Messages\MailMessage;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'status_akun',
        'foto_profile',
        'alamat',
        'pekerjaan',
        'umur',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Override: Mengirim notifikasi reset password kustom
     */
    public function sendPasswordResetNotification($token)
    {
        // Membuat URL reset password sesuai route bawaan Laravel/Breeze
        $url = url(route('password.reset', [
            'token' => $token,
            'email' => $this->getEmailForPasswordReset(),
        ], false));

        // Memberitahu Laravel untuk menggunakan file blade kustom
        $this->notify(new class($url) extends ResetPasswordNotification {
            protected $url;
            public function __construct($url) { $this->url = $url; }

            public function toMail($notifiable)
            {
                return (new MailMessage)
                    ->subject('Reset Password Notification - MiqotHub')
                    ->markdown('emails.auth.reset_password', ['url' => $this->url]);
            }
        });
    }

    // Relationships
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function exerciseScores() {
        return $this->hasMany(ExerciseScore::class);
    }

    /**
     * Helper: Mendapatkan kursus yang sudah diverifikasi/lunas
     */
    public function courses()
    {
        return \App\Models\Course::join('course_transaction', 'courses.id', '=', 'course_transaction.course_id')
            ->join('transactions', 'transactions.id', '=', 'course_transaction.transaction_id')
            ->where('transactions.user_id', $this->id)
            ->where('transactions.status', 'verified')
            ->select('courses.*')
            ->distinct();
    }
}