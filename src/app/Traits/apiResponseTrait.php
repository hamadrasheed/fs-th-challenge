<?php

namespace App\Traits;

use App\Helpers\EnvHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Response as FacadesResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

trait apiResponseTrait
{
    /**
     * infoResponse
     *
     * @return array
     */
    private function infoResponse()
    {
        return [
            'provider' => [
                "name" => EnvHelper::get("APP_PROVIDER"),
                'company_profile' => EnvHelper::get("APP_PROVIDER_URL"),
            ],
            'version' => EnvHelper::get("APP_VERSION"),
        ];
    }

    /**
     * defaultResponse
     *
     * @param  mixed $message
     * @param  mixed $status
     * @param  mixed $data
     * @return \Illuminate\Http\Response
     */
    private function defaultResponse($message, $status, $data = null)
    {
        $response = [
            "message" => $message,
        ];

        if ($data)
            foreach ($data as $key => $dt) {
                $response[$key] = $dt;
            }

        $response["other_informations"] = $this->infoResponse();

        return response($response, $status);
    }

    /**
     * defaultErrorResponse
     *
     * @param  Throwable $exception
     * @param  array $message
     * @param  Response $status
     */
    private function defaultErrorResponse($exception, $message, $status)
    {
        $response = [];
        // if validate
        if ($exception instanceof ValidationException) {
            // @phpstan-ignore-next-line
            return $this->ResponseValidateWarning($exception->errors(), null);
        }

        // use dev mode
        // @phpstan-ignore-next-line
        if ($exception && EnvHelper::get('APP_DEBUG') == 'true') {
            $response['message'] = __('response.failed.custom', ['custom' => $exception->getMessage()]);
            if ($exception instanceof QueryException)
                $response['sql'] = $exception->getSql();
            $response['trace'] = $exception->getTrace();
        }

        // query result null
        if ($exception instanceof ModelNotFoundException) {
            // @phpstan-ignore-next-line
            return $this->notFoundHttp($exception, request());
        }

        // @phpstan-ignore-next-line
        if (!$exception || EnvHelper::get('APP_DEBUG') == 'false')
            $response['message'] = $message;

        $response['other_informations'] = $this->infoResponse();


        // @phpstan-ignore-next-line
        return response($response, $status);
    }

    /**
     * notFoundHttp
     *
     * @param  NotFoundHttpException|ModelNotFoundException $exception
     * @param  Illuminate\Http\Request $request
     * @phpstan-ignore-next-line
     */
    protected function notFoundHttp($exception, $request)
    {
        // @phpstan-ignore-next-line
        if ($request->is('api/*')) {
            $instance = $exception->getPrevious() ?? $exception;

            // when spesific model
            if ($instance instanceof Model) {
                $modelName = explode('\\', $instance->getModel());

                // get last path
                $modelName = $modelName[count($modelName) - 1];

                // camel case to with space
                // to lower case
                $modelName = str(implode(' ', preg_split('/(?=[A-Z])/', $modelName)))->squish()->lower();

                return $this->ResponseNotFoundWarning(($modelName));
            }

            return $this->ResponseNotFoundWithoutNameWarning();
        }
    }


    /**
     * load data success
     *
     * @param  mixed $data = [result]
     * @param  bool $usePaginate
     * @param  array $other
     * @param  int $status= http status
     * @return \Illuminate\Http\Response
     */
    public function responseLoadDataSuccess($data, $name,  $usePaginate = false, $other = [], $status = Response::HTTP_OK)

    {
        $data = gettype($data) !== 'array' ? $data->toArray() : $data;
        $count = 0;

        if (!$usePaginate && isset($data[0]))
            $count = count($data);

        if (!$usePaginate && !isset($data[0]) && count($data))
            $count = 1;

        if ($usePaginate)
            $count = $data['total'];

        $result = [
            "result" => $data,
            "total" => $count,
        ];

        if (count($other))
            $result = array_replace($result, $other);

        return $this->defaultResponse(__('response.success.loaded', ['name' => $name]), $status, $result);
    }

    public function responseStringSuccess($data, $name, $other = [], $status = Response::HTTP_OK)
    {
        $result = ["result" => $data];
        $result = [...$result, ...$other];
        return $this->defaultResponse(__('response.success.loaded', ['name' => $name]), $status, $result);
    }

    public function responseDetailDataSuccess($data, $name, $permissions = null, $other = [], $status = Response::HTTP_OK)
    {
        $data = !in_array(gettype($data), ['string', 'array']) ? $data->toArray() : $data;


        $result = [
            "result" => $data,
            "permissions" => $permissions ? $permissions : [
                'can_delete' => true,
                'can_update' => true,
            ],
            "total" => 1,
        ];

        if (count($other))
            $result = array_replace($result, $other);

        return $this->defaultResponse(__('response.success.loaded', ['name' => $name]), $status, $result);
    }
    public function responseExportSuccess($data, $name, $other = [], $status = Response::HTTP_OK)
    {
        $data = gettype($data) !== 'array' ? $data->toArray() : $data;


        $result = [
            "result" => $data,
        ];

        if (count($other))
            $result = array_replace($result, $other);

        return $this->defaultResponse(__('response.success.loaded', ['name' => $name]), $status, $result);
    }

    /**
     * success
     *
     * @param  int $status= http status
     * @return \Illuminate\Http\Response
     */
    public function responseCreatedSuccess($name, $status = Response::HTTP_CREATED)
    {
        return $this->defaultResponse(__('response.success.created', ['name' => $name]), $status);
    }

    public function responseUpdatedSuccess($name, $status = Response::HTTP_CREATED)
    {
        return $this->defaultResponse(__('response.success.updated', ['name' => $name]), $status);
    }

    public function responseDeletedSuccess($name, $status = Response::HTTP_ACCEPTED)
    {
        return $this->defaultResponse(__('response.success.deleted', ['name' => $name]), $status);
    }
    public function responseRestoreSuccess($name, $status = Response::HTTP_ACCEPTED)
    {
        return $this->defaultResponse(__('response.success.restore', ['name' => $name]), $status);
    }
    public function responseAbortSuccess($name, $status = Response::HTTP_ACCEPTED)
    {
        return $this->defaultResponse(__('response.success.aborted', ['name' => $name]), $status);
    }

    public function responsecanUsedSuccess($name, $status = Response::HTTP_OK)
    {
        return $this->defaultResponse(__('response.success.can_used', ['name' => $name]), $status);
    }

    public function responseconfirmedSuccess($name, $data = null, $status = Response::HTTP_ACCEPTED)
    {
        $data = $data ? ['result' => $data] : null;
        return $this->defaultResponse(__('response.success.confirmed', ['name' => $name]), $status, $data);
    }
    public function responseCustomSuccess($subtitle, $data = null, $status = Response::HTTP_OK)
    {
        $data = $data ? ['result' => $data] : null;
        return $this->defaultResponse(__('response.success.custom', ['success' => $subtitle]), $status, $data);
    }

    /**
     * warning
     *
     * @param  array $warning (opt)
     * @param  int $status
     * @return \Illuminate\Http\Response
     */
    public function ResponseValidateWarning($warning = [], $name = null, $status = Response::HTTP_UNPROCESSABLE_ENTITY)
    {
        $message = $name ? __('response.warning.validate', ['name' => $name]) : __('response.warning.validate_without_name');
        return $this->defaultResponse($message, $status, [
            "meta" => $warning,
        ]);
    }

    public function ResponseNotFoundWarning($name, $status = Response::HTTP_NOT_FOUND)
    {
        return $this->defaultResponse(__('response.warning.notfound', ['name' => $name]), $status);
    }

    public function ResponseNotFoundWithoutNameWarning($status = Response::HTTP_NOT_FOUND)
    {
        return $this->defaultResponse(__('response.warning.notfound', ['name' => 'request']), $status);
    }

    public function responseCantDeleted($status = Response::HTTP_FORBIDDEN)
    {
        return $this->defaultResponse(__('response.warning.cant_delete'), $status);
    }

    public function responseCantUpdated($status = Response::HTTP_FORBIDDEN)
    {
        return $this->defaultResponse(__('response.warning.cant_update'), $status);
    }

    //
    /**
     * responseWaitingEmailConfirm
     *
     * @param  int $status
     * @return \Illuminate\Http\Response
     */
    public function responseWaitingEmailConfirm($status = Response::HTTP_UNAUTHORIZED)
    {
        return $this->defaultResponse(__('response.warning.email_confirm'), $status);
    }

    /**
     * responseInactive
     *
     * @param  int $status
     * @return \Illuminate\Http\Response
     */
    public function responseInactive($status = Response::HTTP_UNAUTHORIZED)
    {
        return $this->defaultResponse(__('response.warning.inactive'), $status);
    }


    /**
     * failed
     *
     * @param  string $name
     * @param  int $status= http status
     * @return \Illuminate\Http\Response
     */
    public function responseLoadDataFailed($exception, $name, $status = Response::HTTP_NOT_FOUND)
    {
        // @phpstan-ignore-next-line
        return $this->defaultErrorResponse($exception, __('response.failed.loaded', ['name' => $name]), $status);
    }


    public function responseCreatedFailed($exception, $name, $status = Response::HTTP_BAD_REQUEST)
    {
        return $this->defaultErrorResponse($exception, __('response.failed.created', ['name' => $name]), $status);
    }

    public function responseUpdatedFailed($exception, $name, $status = Response::HTTP_BAD_REQUEST)
    {
        return $this->defaultErrorResponse($exception, __('response.failed.updated', ['name' => $name]), $status);
    }

    public function responseDeletedFailed($exception, $name, $status = Response::HTTP_BAD_REQUEST)
    {
        return $this->defaultErrorResponse($exception, __('response.failed.deleted', ['name' => $name]), $status);
    }

    public function responseRestoreFailed($exception, $name, $status = Response::HTTP_BAD_REQUEST)
    {
        return $this->defaultErrorResponse($exception, __('response.failed.restore', ['name' => $name]), $status);
    }
    public function responseAbortFailed($exception, $name, $status = Response::HTTP_BAD_REQUEST)
    {
        return $this->defaultErrorResponse($exception, __('response.failed.aborted', ['name' => $name]), $status);
    }

    public function responsecanUsedFailed($exception, $name, $status = Response::HTTP_NOT_ACCEPTABLE)
    {
        return $this->defaultErrorResponse($exception, __('response.failed.can_used', ['name' => $name]), $status);
    }

    public function responseconfirmedFailed($exception, $name, $status = Response::HTTP_NOT_ACCEPTABLE)
    {
        return $this->defaultErrorResponse($exception, __('response.failed.confirmed', ['name' => $name]), $status);
    }
    public function responseUnauthorized($exception, $name, $status = Response::HTTP_UNAUTHORIZED)
    {
        return $this->defaultErrorResponse($exception, __('response.failed.unauthorized', ['name' => $name]), $status);
    }

    public function responseRto($exception, $name, $status = Response::HTTP_UNAUTHORIZED)
    {
        return $this->defaultErrorResponse($exception, __('response.failed.rto', ['name' => $name]), $status);
    }
    public function responseUnregisteredRoute($exception, $status = Response::HTTP_BAD_REQUEST)
    {
        return $this->defaultErrorResponse($exception, __('response.failed.un_route'), $status);
    }
    public function responseCustomFailed($exception, $message, $status = Response::HTTP_BAD_REQUEST)
    {
        return $this->defaultErrorResponse($exception, __('response.failed.custom', ['custom' => $message]), $status);
    }
}
