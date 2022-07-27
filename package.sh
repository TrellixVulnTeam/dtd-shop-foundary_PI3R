#!/usr/bin/bash
zip -r dtd-shop-foundary.zip ./dist/dtdShopV3* ./dist/fonts/* ./dist/img/* ./dtd.js module.json
aws s3 cp module.json s3://dtd-dnd-assets/dtd-shop-v3/module.json
aws s3 cp dtd-shop-foundary.zip s3://dtd-dnd-assets/dtd-shop-v3/dtd-shop-foundary.zip