<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Firebase;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class FirebaseController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => ['required', 'string']
            ]);
        if ($validator->fails()) {
            return response(null, 422);
        }

        $user = $request->user();

        $firebase = Firebase::where('token', '=', $request->get('token'))->first();

        if (!$firebase) {
            Firebase::create([
                'token' => $request->get('token'),
                'user_id' => $user->id
            ]);
        } else {
            $firebase->update([
                'token' => $request->get('token'),
                'user_id' => $user->id
            ]);
        }
        return response(null, 201);
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function sendNotifications(Request $request) {
        $user = $request->user();
        $firebases = Firebase::get();
        $tokens = [];

        foreach ($firebases as $firebase) {
            $tokens[] = $firebase->token;
        }

        $notification = FirebaseController::sendNotification($tokens,  array("message" => "Tests"), array(
            "title" => "Notification",
            "body" =>  $user->email . " à envoyé une notification."
        ));

        return response()->json($notification, 200);
    }

    /**
     * @param $tokens array
     * @param $data array
     * @param $notification array
     * @return bool|string|null
     */
    static public function sendNotification($tokens, $data, $notification) {
        $url = 'https://fcm.googleapis.com/fcm/send';
        $fields = array(
            'registration_ids' => $tokens,
            'data' => $data,
            "notification" => $notification
        );

        $headers = array(
            'Authorization:key=AAAAZ38EDY4:APA91bHtcRNTQYEm0nvBTVvAkTw-BF1T75rGadhVVbhiTNS9QLLT-LdRE5vjHrnEwoLesLT9UMqI_Pk-OmrWPTIZUh04ZFVQ2-72Kxji69uDC3YxDBZfFpPpHoKI0DMTeHp-xeH5rbJn',
            'Content-Type: application/json'
        );

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
        $result = curl_exec($ch);
        if ($result === FALSE) {
            return null;
        }

        curl_close($ch);
        return $result;
    }
}
