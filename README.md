
様々な、というかcdkで自分が比較的よく作るAWSのリソースについて、エクスポートしてあるものについて、そのリソースへのURLや名前を表示するPythonのスクリプト

まずデプロイ

```
cdk deploy
```

実行環境の作成

```
python -m venv test/env
source test/env/bin/activate
python -m pip install boto3
```

実行

```
source test/env/bin/activate
python test/show_exported.py
```