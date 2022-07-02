
様々な、というかcdkで自分が比較的よく作るAWSのリソースについて、エクスポートしてあるものについて、そのリソースへのURLや名前を表示するPythonのスクリプト

機能させるために、CfnOutputの**description**に、そのARNの種類を文字として書いておくことが必要。

以下の例では**iam role arn**がそれにあたる。
```
new CfnOutput(this, 'RoleArnOutput', { 
  exportName: 'xxxxxx', 
  value: role.roleArn,
  description: "iam role arn"
})
```
ここで重要なのは、iam以外に何が書かれていても関係ないということ。
またiamと書かれていたからといって、必ずそのリソースへのURLが生成されるわけではなく、URLの一部として利用できそうな場合だけ、かつ、うまくいけば有効なURLが生成されるという、いいかげんな作りになっている。

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