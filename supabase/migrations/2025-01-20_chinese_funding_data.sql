-- 中国AI公司融资信息数据
-- 包含各公司的融资轮次、投资方和估值信息

-- 插入百度的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'IPO', 1000000000, ARRAY['NASDAQ', 'Public Market'], '2005-08-01'
FROM public.companies c WHERE c.name = '百度';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 100000000, ARRAY['Google', 'DFJ', 'Integrity Partners'], '2004-06-01'
FROM public.companies c WHERE c.name = '百度';

-- 插入阿里巴巴的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'IPO', 25000000000, ARRAY['NYSE', 'Public Market'], '2014-09-01'
FROM public.companies c WHERE c.name = '阿里巴巴';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series D', 2000000000, ARRAY['SoftBank', 'Yahoo', 'Temasek'], '2005-08-01'
FROM public.companies c WHERE c.name = '阿里巴巴';

-- 插入腾讯的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'IPO', 2000000000, ARRAY['HKEX', 'Public Market'], '2004-06-01'
FROM public.companies c WHERE c.name = '腾讯';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 32000000, ARRAY['IDG Capital', 'PCCW'], '2000-06-01'
FROM public.companies c WHERE c.name = '腾讯';

-- 插入字节跳动的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series F', 5000000000, ARRAY['Sequoia Capital', 'General Atlantic', 'KKR'], '2020-03-01'
FROM public.companies c WHERE c.name = '字节跳动';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series E', 3000000000, ARRAY['SoftBank', 'KKR', 'General Atlantic'], '2018-10-01'
FROM public.companies c WHERE c.name = '字节跳动';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series D', 1000000000, ARRAY['Sequoia Capital', 'SIG', 'Source Code Capital'], '2017-08-01'
FROM public.companies c WHERE c.name = '字节跳动';

-- 插入商汤科技的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series D', 1200000000, ARRAY['SoftBank Vision Fund', 'Alibaba', 'Temasek'], '2021-12-01'
FROM public.companies c WHERE c.name = '商汤科技';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 600000000, ARRAY['Alibaba', 'Temasek', 'Qualcomm Ventures'], '2018-05-01'
FROM public.companies c WHERE c.name = '商汤科技';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 410000000, ARRAY['Alibaba', 'Temasek', 'Qualcomm Ventures'], '2017-07-01'
FROM public.companies c WHERE c.name = '商汤科技';

-- 插入科大讯飞的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'IPO', 500000000, ARRAY['SZSE', 'Public Market'], '2008-05-01'
FROM public.companies c WHERE c.name = '科大讯飞';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 20000000, ARRAY['IDG Capital', 'Legend Capital'], '2004-06-01'
FROM public.companies c WHERE c.name = '科大讯飞';

-- 插入旷视科技的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series D', 750000000, ARRAY['Alibaba', 'Boyu Capital', 'Ant Financial'], '2019-05-01'
FROM public.companies c WHERE c.name = '旷视科技';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 460000000, ARRAY['Alibaba', 'Boyu Capital', 'Ant Financial'], '2017-10-01'
FROM public.companies c WHERE c.name = '旷视科技';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['Alibaba', 'Boyu Capital'], '2016-12-01'
FROM public.companies c WHERE c.name = '旷视科技';

-- 插入寒武纪科技的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'IPO', 300000000, ARRAY['SSE', 'Public Market'], '2020-07-01'
FROM public.companies c WHERE c.name = '寒武纪科技';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['Alibaba', 'Temasek', 'Qualcomm Ventures'], '2018-06-01'
FROM public.companies c WHERE c.name = '寒武纪科技';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 40000000, ARRAY['Alibaba', 'Temasek'], '2017-08-01'
FROM public.companies c WHERE c.name = '寒武纪科技';

-- 插入优必选科技的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 820000000, ARRAY['Tencent', 'ZhenFund', 'CDH Investments'], '2018-05-01'
FROM public.companies c WHERE c.name = '优必选科技';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['ZhenFund', 'CDH Investments'], '2016-07-01'
FROM public.companies c WHERE c.name = '优必选科技';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 20000000, ARRAY['ZhenFund', 'CDH Investments'], '2014-08-01'
FROM public.companies c WHERE c.name = '优必选科技';

-- 插入MiniMax的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 600000000, ARRAY['Tencent', 'Alibaba', 'Hillhouse Capital'], '2024-03-01'
FROM public.companies c WHERE c.name = 'MiniMax';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 100000000, ARRAY['Hillhouse Capital', 'IDG Capital'], '2022-06-01'
FROM public.companies c WHERE c.name = 'MiniMax';

-- 插入智谱AI的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 200000000, ARRAY['Alibaba', 'Tencent', 'Hillhouse Capital'], '2024-01-01'
FROM public.companies c WHERE c.name = '智谱AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 100000000, ARRAY['Hillhouse Capital', 'IDG Capital'], '2023-06-01'
FROM public.companies c WHERE c.name = '智谱AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 50000000, ARRAY['Hillhouse Capital', 'IDG Capital'], '2022-03-01'
FROM public.companies c WHERE c.name = '智谱AI';

-- 插入月之暗面的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 200000000, ARRAY['Alibaba', 'Tencent', 'Hillhouse Capital'], '2024-02-01'
FROM public.companies c WHERE c.name = '月之暗面';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 100000000, ARRAY['Hillhouse Capital', 'IDG Capital'], '2023-06-01'
FROM public.companies c WHERE c.name = '月之暗面';

-- 插入零一万物的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 100000000, ARRAY['Alibaba', 'Tencent', 'Hillhouse Capital'], '2024-01-01'
FROM public.companies c WHERE c.name = '零一万物';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 50000000, ARRAY['Hillhouse Capital', 'IDG Capital'], '2023-08-01'
FROM public.companies c WHERE c.name = '零一万物';

-- 插入百川智能的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 100000000, ARRAY['Alibaba', 'Tencent', 'Hillhouse Capital'], '2024-01-01'
FROM public.companies c WHERE c.name = '百川智能';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 50000000, ARRAY['Hillhouse Capital', 'IDG Capital'], '2023-09-01'
FROM public.companies c WHERE c.name = '百川智能';

-- 插入深言科技的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 200000000, ARRAY['Alibaba', 'Tencent', 'Hillhouse Capital'], '2024-01-01'
FROM public.companies c WHERE c.name = '深言科技';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 100000000, ARRAY['Hillhouse Capital', 'IDG Capital'], '2023-10-01'
FROM public.companies c WHERE c.name = '深言科技';

-- 插入来也科技的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 100000000, ARRAY['Tencent', 'Hillhouse Capital', 'IDG Capital'], '2021-07-01'
FROM public.companies c WHERE c.name = '来也科技';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 50000000, ARRAY['Hillhouse Capital', 'IDG Capital'], '2019-03-01'
FROM public.companies c WHERE c.name = '来也科技';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 20000000, ARRAY['IDG Capital', 'ZhenFund'], '2017-06-01'
FROM public.companies c WHERE c.name = '来也科技';

-- 插入第四范式的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series D', 700000000, ARRAY['Tencent', 'Hillhouse Capital', 'IDG Capital'], '2021-01-01'
FROM public.companies c WHERE c.name = '第四范式';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 200000000, ARRAY['Hillhouse Capital', 'IDG Capital'], '2019-05-01'
FROM public.companies c WHERE c.name = '第四范式';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['IDG Capital', 'ZhenFund'], '2017-12-01'
FROM public.companies c WHERE c.name = '第四范式';

-- 插入云从科技的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 200000000, ARRAY['Alibaba', 'Temasek', 'Qualcomm Ventures'], '2020-05-01'
FROM public.companies c WHERE c.name = '云从科技';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['Alibaba', 'Temasek'], '2018-10-01'
FROM public.companies c WHERE c.name = '云从科技';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['Alibaba', 'Temasek'], '2017-03-01'
FROM public.companies c WHERE c.name = '云从科技';

-- 插入依图科技的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series D', 300000000, ARRAY['Alibaba', 'Temasek', 'Qualcomm Ventures'], '2020-11-01'
FROM public.companies c WHERE c.name = '依图科技';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 200000000, ARRAY['Alibaba', 'Temasek'], '2018-06-01'
FROM public.companies c WHERE c.name = '依图科技';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['Alibaba', 'Temasek'], '2017-05-01'
FROM public.companies c WHERE c.name = '依图科技';

-- 插入思必驰的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series D', 100000000, ARRAY['Alibaba', 'Tencent', 'Hillhouse Capital'], '2021-03-01'
FROM public.companies c WHERE c.name = '思必驰';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 50000000, ARRAY['Alibaba', 'Tencent'], '2019-08-01'
FROM public.companies c WHERE c.name = '思必驰';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 20000000, ARRAY['Alibaba', 'Tencent'], '2017-12-01'
FROM public.companies c WHERE c.name = '思必驰';
