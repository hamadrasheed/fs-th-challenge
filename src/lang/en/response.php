<?php

return [
    'success' => [
        'created' => [
            'title' => "SUCCESS!",
            'subtitle' => "Data \":name\" is successfully added to the database.",
            'status' => "success",
        ],
        'loaded' => [
            'title' => "SUCCESS!",
            'subtitle' => "Data \":name\" is successfully loaded.",
            'status' => "success",
        ],
        'deleted' => [
            'title' => "SUCCESS!",
            'subtitle' => "Data \":name\" is successfully removed from the database.",
            'status' => "success",
        ],
        'restore' => [
            'title' => "SUCCESS!",
            'subtitle' => "Data \":name\" is successfully restore from the database.",
            'status' => "success",
        ],
        'aborted' => [
            'title' => "SUCCESS!",
            'subtitle' => "Data \":name\" is successfully aborted.",
            'status' => "success",
        ],
        'updated' => [
            'title' => "SUCCESS!",
            'subtitle' => "Data \":name\" is successfully updated.",
            'status' => "success",
        ],
        'confirmed' => [
            'title' => "HORRAAY!",
            'subtitle' => "the \":name\" has been confirmed",
            'status' => "success",
        ],
        'can_used' => [
            'title' => "HORRAAY!",
            'subtitle' => "The :name can used.",
            'status' => "success",
        ],
        'custom' => [
            'title' => "SUCCESS!",
            'subtitle' => ":success",
            'status' => "success",
        ],
    ],
    'warning' => [
        'validate' => [
            'title' => "ATTENTION!",
            'subtitle' => "there is an error in the input of the \":name\" form",
            'status' => "warning ",
        ],
        'validate_without_name' => [
            'title' => "ATTENTION!",
            'subtitle' => "there is an error in the input of the form",
            'status' => "warning ",
        ],
        'notfound' => [
            'title' => "NOT FOUND!",
            "subtitle" => "The :name not found.",
            "status" => "warning",
        ],
        'cant_delete' => [
            'title' => "ATTENTION!",
            "subtitle" => "Data cannot be deleted because has been used on transaction",
            "status" => "warning",
        ],
        'cant_update' => [
            'title' => "ATTENTION!",
            "subtitle" => "Data cannot be updated because has been used on transaction",
            "status" => "warning",
        ],
        'email_confirm' => [
            'title' => "ATTENTION!",
            "subtitle" => "confirm your email first...",
            "status" => "warning",
        ],
        'inactive' => [
            'title' => "ATTENTION!",
            "subtitle" => "your account is inactive..",
            "status" => "warning",
        ],
        'custom' => [
            'title' => "ATTENTION!",
            "subtitle" => ":custom",
            "status" => "warning",
        ],
    ],
    'failed' => [
        'created' => [
            'title' => "Oops..!",
            'subtitle' => "Failed to add data \":name\" to the database.",
            'status' => "error",
        ],
        'loaded' => [
            'title' => "Oops..!",
            'subtitle' => "Failed to load data \":name\".",
            'status' => "error",
        ],
        'deleted' => [
            'title' => "Oops..!",
            'subtitle' => "Failed to remove data \":name\" from the database.",
            'status' => "error",
        ],
        'deleted' => [
            'title' => "Oops..!",
            'subtitle' => "Failed to restore data \":name\" from the database.",
            'status' => "error",
        ],
        'aborted' => [
            'title' => "Oops..!",
            'subtitle' => "Failed to abort data \":name\".",
            'status' => "error",
        ],
        'updated' => [
            'title' => "Oops..!",
            'subtitle' => "Failed to update data \":name\".",
            'status' => "error",
        ],
        'confirmed' => [
            'title' => "Oops..!",
            'subtitle' => "the \":name\" hasn't been confirmed",
            'status' => "error",
        ],
        'can_used' => [
            'title' => "Oops..!",
            'subtitle' => "The :name can't used.",
            'status' => "error",
        ],
        'unauthorized' => [
            'title' => "UNAUTHORIZED!",
            "subtitle" => "It seems that you don't have any access to :name.",
            "status" => "error",
        ],
        'rto' => [
            'title' => "UNAUTHORIZED!",
            "subtitle" => "it looks like the :name you accessed is no longer valid",
            "status" => "error",
        ],
        'un_route' => [
            'title' => "Oops..!",
            "subtitle" => "unregistered route",
            "status" => "error",
        ],
        'is_robot' => [
            'title' => "Oops..!",
            "subtitle" => "We do not accept robots",
            "status" => "error",
        ],
        'custom' => [
            'title' => "Oops..!",
            "subtitle" => ":custom",
            "status" => "error",
        ],
    ],
];
