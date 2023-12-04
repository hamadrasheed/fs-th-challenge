<?php

namespace App\Http\Controllers\api\utils;

use App\Http\Controllers\Controller;
use App\Models\NewsAuthor;
use App\Models\NewsCategory;
use App\Models\NewsCountry;
use App\Models\NewsLanguage;
use App\Models\NewsSource;
use App\Models\UserInformation;
use App\Traits\apiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OptionController extends Controller
{
    use apiResponseTrait;

    /**
     * get news category list
     *
     * @param string $q
     * @return [{"code": "category_code", "name": "category_name"}]
     */
    public function newsCategory(Request $request)
    {
        $name = __('vars.models.NewsCategory');
        $model = new NewsCategory();

        $request->validate($model->requestList(['only' => ['q']]));

        try {
            $search = $request->q;

            $data = $model->query()
                ->when($search, function ($query) use ($search) {
                    $query->where(
                        fn ($q) => $q
                            ->where('code', 'LIKE', "%$search%")
                            ->orWhere('name', 'LIKE', "%$search%")
                    );
                })
                ->select('code', 'name')
                ->orderBy('name')
                ->get();

            return  $this->responseLoadDataSuccess(data: $data, name: $name);
        } catch (\Throwable $e) {
            return $this->responseLoadDataFailed(exception: $e, name: $name);
        }
    }

    /**
     * get news language list
     *
     * @param string $q
     * @return [{"code": "language_code", "name": "language_name"}]
     */
    public function newsLanguage(Request $request)
    {
        $name = __('vars.models.NewsLanguage');
        $model = new NewsLanguage();

        $request->validate($model->requestList(['only' => ['q']]));

        try {
            $search = $request->q;

            $data = $model->query()
                ->when($search, function ($query) use ($search) {
                    $query->where(
                        fn ($q) => $q
                            ->where('code', 'LIKE', "%$search%")
                            ->orWhere('name', 'LIKE', "%$search%")
                    );
                })
                ->select('code', 'name')
                ->orderBy('name')
                ->get();

            return  $this->responseLoadDataSuccess(data: $data, name: $name);
        } catch (\Throwable $e) {
            return $this->responseLoadDataFailed(exception: $e, name: $name);
        }
    }

    /**
     * get news country list
     *
     * @param string $q
     * @return [{"code": "country_code","name": "country_name"}]
     */
    public function newsCountry(Request $request)
    {
        $name = __('vars.models.NewsCountry');
        $model = new NewsCountry();

        $request->validate($model->requestList(['only' => ['q']]));

        try {
            $search = $request->q;

            $data = $model->query()
                ->when($search, function ($query) use ($search) {
                    $query->where(
                        fn ($q) => $q
                            ->where('code', 'LIKE', "%$search%")
                            ->orWhere('name', 'LIKE', "%$search%")
                    );
                })
                ->select('code', 'name')
                ->orderBy('name')
                ->get();

            return  $this->responseLoadDataSuccess(data: $data, name: $name);
        } catch (\Throwable $e) {
            return $this->responseLoadDataFailed(exception: $e, name: $name);
        }
    }

    /**
     * get news author list
     *
     * @param string $q
     * @return [{"code": "author_code","name": "author_name - source_name"}]
     */
    public function newsAuthor(Request $request)
    {
        $name = __('vars.models.NewsAuthor');
        $model = new NewsAuthor();

        $request->validate($model->requestList(['only' => ['q']]));

        try {
            $search = $request->q;

            $data = $model->setAlias()
                ->when($search, function ($query) use ($search) {
                    $query->where(
                        fn ($q) => $q
                            ->where('mna.name', 'LIKE', "%$search%")
                            ->orWhere('mns.name', 'LIKE', "%$search%")
                    );
                })
                ->select('mna.code', DB::raw("CONCAT(mna.name, ' - ', mns.name) as name"))
                ->newsSourceRelation()
                ->orderBy('mna.name')
                ->get();

            return  $this->responseLoadDataSuccess(data: $data, name: $name);
        } catch (\Throwable $e) {
            return $this->responseLoadDataFailed(exception: $e, name: $name);
        }
    }

    /**
     * get news source list
     *
     * @param string $q
     * @return [{"code": "source_code","name": "source_name"}]
     */
    public function newsSource(Request $request)
    {
        $name = __('vars.models.NewsSource');
        $model = new NewsSource();

        $request->validate($model->requestList(['only' => ['q']]));

        try {
            $search = $request->q;

            $data = $model->query()
                ->when($search, function ($query) use ($search) {
                    $query->where(
                        fn ($q) => $q
                            ->where('code', 'LIKE', "%$search%")
                            ->orWhere('name', 'LIKE', "%$search%")
                    );
                })
                ->select('code', 'name')
                ->orderBy('name')
                ->get();

            return  $this->responseLoadDataSuccess(data: $data, name: $name);
        } catch (\Throwable $e) {
            return $this->responseLoadDataFailed(exception: $e, name: $name);
        }
    }

    /**
     * get user gender list
     *
     * @param string $q
     * @return [{"code": "value","name": "value"}]
     */
    public function gender(Request $request)
    {
        $name = __('vars.utils.user.gender');
        $search = $request->q;
        try {
            $data = [];

            if ($search)
                foreach (UserInformation::genderList() as $e) {
                    if (str_contains(strtolower($e), strtolower($search)))
                        $data[] = $e;
                }
            else $data = UserInformation::genderList();

            $data = count($data) ? collect($data)->map(fn ($e) => [
                'code' => $e,
                'name' => $e,
            ]) : [];

            return  $this->responseLoadDataSuccess(data: $data, name: $name);
        } catch (\Throwable $e) {
            return $this->responseLoadDataFailed(exception: $e, name: $name);
        }
    }
}
