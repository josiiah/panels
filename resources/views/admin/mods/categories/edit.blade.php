@extends('layouts.admin')

@section('title')
    Edit Mod
@endsection

@section('content-header')
    <h1>Edit Category
        <small>Edit an mod category.</small>
    </h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li><a href="{{ route('admin.mods') }}">Mod Manager</a></li>
        <li class="active">Edit Category</li>
    </ol>
@endsection

@section('content')
    <div class="row">
        <div class="col-xs-12">
            <div class="box box-primary">
                <div class="box-header with-border">
                    <h3 class="box-title">Edit Category</h3>
                    <div class="box-tools">
                        <a href="{{ route('admin.mods') }}">
                            <button type="button" class="btn btn-sm btn-primary"
                                    style="border-radius: 0 3px 3px 0;margin-left:-1px;">Go Back
                            </button>
                        </a>
                    </div>
                </div>
                <form method="post" action="{{ route('admin.mods.categories.update', $category->id)  }}">
                    <div class="box-body">
                        <div class="form-group">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" name="name" id="name" class="form-control"
                                   placeholder="ZAP Ad Remover" value="{{ $category->name }}" />
                        </div>
                    </div>
                    <div class="box-footer">
                        {!! csrf_field() !!}
                        <button class="btn btn-success pull-right" type="submit">Update</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection

