# 残高管理アプリ 仕様書

## 第1段階の目的
基準日時点の残高を登録し、保存・表示できるようにする。

## 扱うデータ
- baseBalance
  - 基準日時点の残高
  - number
- baseDate
  - 残高計算の基準日
  - string

## 画面に必要な要素
- 残高入力欄
- 基準日入力欄
- 保存ボタン
- 残高表示エリア
- 基準日表示エリア

## 必要な処理
- 入力値を取得する
- 入力値を localStorage に保存する
- localStorage から読み込む
- 読み込んだ内容を画面に表示する

## 関数案
- getBalanceData()
- saveBalanceData(data)
- loadBalanceData()
- renderBalanceData(data)