<?php

namespace App\Http\Resources\API;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class User
 * @package App\Http\Resources\API
 * @property integer $id
 * @property string $username
 * @property string $email
 * @property string $password
 * @property Carbon $created_at
 * @property Carbon $updated_at
 **/
class User extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            "id" => $this->id,
            "username" => $this->username,
            "email" => $this->email,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at
        ];
    }
}
