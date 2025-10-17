-- 全球AI公司融资信息数据
-- 包含各公司的融资轮次、投资方和估值信息

-- 插入香港AI公司的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 15000000, ARRAY['Sequoia Capital China', 'GGV Capital'], '2023-06-01'
FROM public.companies c WHERE c.name = 'Votee AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 5000000, ARRAY['500 Global', 'Cyberport'], '2022-03-01'
FROM public.companies c WHERE c.name = 'Votee AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 10000000, ARRAY['Alibaba', 'Tencent'], '2023-03-01'
FROM public.companies c WHERE c.name = 'FormX';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 20000000, ARRAY['Hillhouse Capital', 'IDG Capital'], '2023-08-01'
FROM public.companies c WHERE c.name = 'Measurable AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 10000000, ARRAY['Sequoia Capital', 'GGV Capital'], '2022-05-01'
FROM public.companies c WHERE c.name = 'Measurable AI';

-- 插入新加坡AI公司的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series H', 2000000000, ARRAY['SoftBank Vision Fund', 'Toyota'], '2021-12-01'
FROM public.companies c WHERE c.name = 'Grab';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series G', 1000000000, ARRAY['SoftBank Vision Fund', 'Toyota'], '2020-06-01'
FROM public.companies c WHERE c.name = 'Grab';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series F', 500000000, ARRAY['SoftBank Vision Fund', 'Toyota'], '2019-03-01'
FROM public.companies c WHERE c.name = 'Grab';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series E', 200000000, ARRAY['SoftBank Vision Fund', 'Toyota'], '2018-06-01'
FROM public.companies c WHERE c.name = 'Grab';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series D', 100000000, ARRAY['SoftBank Vision Fund', 'Toyota'], '2017-09-01'
FROM public.companies c WHERE c.name = 'Grab';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 50000000, ARRAY['SoftBank Vision Fund', 'Toyota'], '2016-12-01'
FROM public.companies c WHERE c.name = 'Grab';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 20000000, ARRAY['SoftBank Vision Fund', 'Toyota'], '2015-08-01'
FROM public.companies c WHERE c.name = 'Grab';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 10000000, ARRAY['SoftBank Vision Fund', 'Toyota'], '2014-06-01'
FROM public.companies c WHERE c.name = 'Grab';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 2000000, ARRAY['SoftBank Vision Fund', 'Toyota'], '2013-03-01'
FROM public.companies c WHERE c.name = 'Grab';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series D', 1000000000, ARRAY['SoftBank Vision Fund', 'Toyota'], '2021-01-01'
FROM public.companies c WHERE c.name = 'Sea Limited';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 500000000, ARRAY['SoftBank Vision Fund', 'Toyota'], '2020-06-01'
FROM public.companies c WHERE c.name = 'Sea Limited';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 200000000, ARRAY['SoftBank Vision Fund', 'Toyota'], '2019-03-01'
FROM public.companies c WHERE c.name = 'Sea Limited';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 100000000, ARRAY['SoftBank Vision Fund', 'Toyota'], '2018-06-01'
FROM public.companies c WHERE c.name = 'Sea Limited';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 400000000, ARRAY['SoftBank Vision Fund', 'Toyota'], '2021-09-01'
FROM public.companies c WHERE c.name = 'Advance Intelligence Group';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 200000000, ARRAY['SoftBank Vision Fund', 'Toyota'], '2020-03-01'
FROM public.companies c WHERE c.name = 'Advance Intelligence Group';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 100000000, ARRAY['SoftBank Vision Fund', 'Toyota'], '2019-06-01'
FROM public.companies c WHERE c.name = 'Advance Intelligence Group';

-- 插入日本AI公司的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 200000000, ARRAY['Toyota', 'NTT', 'FANUC'], '2021-03-01'
FROM public.companies c WHERE c.name = 'Preferred Networks';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['Toyota', 'NTT', 'FANUC'], '2019-06-01'
FROM public.companies c WHERE c.name = 'Preferred Networks';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['Toyota', 'NTT', 'FANUC'], '2017-12-01'
FROM public.companies c WHERE c.name = 'Preferred Networks';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 20000000, ARRAY['Toyota', 'NTT', 'FANUC'], '2016-03-01'
FROM public.companies c WHERE c.name = 'Preferred Networks';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 100000000, ARRAY['Sony', 'SoftBank'], '2020-04-01'
FROM public.companies c WHERE c.name = 'Sony AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 50000000, ARRAY['Sony', 'SoftBank'], '2019-06-01'
FROM public.companies c WHERE c.name = 'Sony AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 500000000, ARRAY['SoftBank', 'Alibaba'], '2020-01-01'
FROM public.companies c WHERE c.name = 'SoftBank Robotics';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 200000000, ARRAY['SoftBank', 'Alibaba'], '2018-06-01'
FROM public.companies c WHERE c.name = 'SoftBank Robotics';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 100000000, ARRAY['SoftBank', 'Alibaba'], '2016-12-01'
FROM public.companies c WHERE c.name = 'SoftBank Robotics';

-- 插入韩国AI公司的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 300000000, ARRAY['SoftBank', 'Alibaba'], '2021-01-01'
FROM public.companies c WHERE c.name = 'Naver';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 200000000, ARRAY['SoftBank', 'Alibaba'], '2020-06-01'
FROM public.companies c WHERE c.name = 'Naver';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 100000000, ARRAY['SoftBank', 'Alibaba'], '2019-03-01'
FROM public.companies c WHERE c.name = 'Naver';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 200000000, ARRAY['SoftBank', 'Alibaba'], '2021-01-01'
FROM public.companies c WHERE c.name = 'Kakao';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['SoftBank', 'Alibaba'], '2020-06-01'
FROM public.companies c WHERE c.name = 'Kakao';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['SoftBank', 'Alibaba'], '2019-03-01'
FROM public.companies c WHERE c.name = 'Kakao';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 150000000, ARRAY['SoftBank', 'Alibaba'], '2021-01-01'
FROM public.companies c WHERE c.name = 'SK Telecom';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['SoftBank', 'Alibaba'], '2020-06-01'
FROM public.companies c WHERE c.name = 'SK Telecom';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['SoftBank', 'Alibaba'], '2019-03-01'
FROM public.companies c WHERE c.name = 'SK Telecom';

-- 插入印度AI公司的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 200000000, ARRAY['SoftBank', 'Alibaba'], '2021-01-01'
FROM public.companies c WHERE c.name = 'Zoho';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['SoftBank', 'Alibaba'], '2020-06-01'
FROM public.companies c WHERE c.name = 'Zoho';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['SoftBank', 'Alibaba'], '2019-03-01'
FROM public.companies c WHERE c.name = 'Zoho';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 300000000, ARRAY['SoftBank', 'Alibaba'], '2021-09-01'
FROM public.companies c WHERE c.name = 'Freshworks';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 200000000, ARRAY['SoftBank', 'Alibaba'], '2020-03-01'
FROM public.companies c WHERE c.name = 'Freshworks';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 100000000, ARRAY['SoftBank', 'Alibaba'], '2019-06-01'
FROM public.companies c WHERE c.name = 'Freshworks';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 500000000, ARRAY['SoftBank', 'Alibaba'], '2021-07-01'
FROM public.companies c WHERE c.name = 'Ola';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 300000000, ARRAY['SoftBank', 'Alibaba'], '2020-03-01'
FROM public.companies c WHERE c.name = 'Ola';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 200000000, ARRAY['SoftBank', 'Alibaba'], '2019-06-01'
FROM public.companies c WHERE c.name = 'Ola';

-- 插入欧洲AI公司的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Acquisition', 500000000, ARRAY['Google'], '2014-01-01'
FROM public.companies c WHERE c.name = 'DeepMind';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 200000000, ARRAY['Google'], '2013-06-01'
FROM public.companies c WHERE c.name = 'DeepMind';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['Google'], '2012-03-01'
FROM public.companies c WHERE c.name = 'DeepMind';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['Google'], '2011-06-01'
FROM public.companies c WHERE c.name = 'DeepMind';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 20000000, ARRAY['Google'], '2010-03-01'
FROM public.companies c WHERE c.name = 'DeepMind';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series D', 200000000, ARRAY['SoftBank', 'Alibaba'], '2020-12-01'
FROM public.companies c WHERE c.name = 'Graphcore';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 100000000, ARRAY['SoftBank', 'Alibaba'], '2019-06-01'
FROM public.companies c WHERE c.name = 'Graphcore';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 50000000, ARRAY['SoftBank', 'Alibaba'], '2018-03-01'
FROM public.companies c WHERE c.name = 'Graphcore';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 20000000, ARRAY['SoftBank', 'Alibaba'], '2017-06-01'
FROM public.companies c WHERE c.name = 'Graphcore';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 10000000, ARRAY['SoftBank', 'Alibaba'], '2016-03-01'
FROM public.companies c WHERE c.name = 'Graphcore';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 150000000, ARRAY['SoftBank', 'Alibaba'], '2021-04-01'
FROM public.companies c WHERE c.name = 'Darktrace';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['SoftBank', 'Alibaba'], '2020-03-01'
FROM public.companies c WHERE c.name = 'Darktrace';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['SoftBank', 'Alibaba'], '2019-06-01'
FROM public.companies c WHERE c.name = 'Darktrace';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 400000000, ARRAY['SoftBank', 'Alibaba'], '2024-02-01'
FROM public.companies c WHERE c.name = 'Mistral AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 200000000, ARRAY['SoftBank', 'Alibaba'], '2023-06-01'
FROM public.companies c WHERE c.name = 'Mistral AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['SoftBank', 'Alibaba'], '2023-11-01'
FROM public.companies c WHERE c.name = 'Aleph Alpha';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['SoftBank', 'Alibaba'], '2022-06-01'
FROM public.companies c WHERE c.name = 'Aleph Alpha';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 20000000, ARRAY['SoftBank', 'Alibaba'], '2021-03-01'
FROM public.companies c WHERE c.name = 'Aleph Alpha';

-- 插入加拿大AI公司的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 300000000, ARRAY['SoftBank', 'Alibaba'], '2023-06-01'
FROM public.companies c WHERE c.name = 'Cohere';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 200000000, ARRAY['SoftBank', 'Alibaba'], '2022-06-01'
FROM public.companies c WHERE c.name = 'Cohere';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 100000000, ARRAY['SoftBank', 'Alibaba'], '2021-06-01'
FROM public.companies c WHERE c.name = 'Cohere';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 50000000, ARRAY['SoftBank', 'Alibaba'], '2020-06-01'
FROM public.companies c WHERE c.name = 'Cohere';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 200000000, ARRAY['SoftBank', 'Alibaba'], '2020-01-01'
FROM public.companies c WHERE c.name = 'Element AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['SoftBank', 'Alibaba'], '2019-06-01'
FROM public.companies c WHERE c.name = 'Element AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['SoftBank', 'Alibaba'], '2018-06-01'
FROM public.companies c WHERE c.name = 'Element AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 20000000, ARRAY['SoftBank', 'Alibaba'], '2017-06-01'
FROM public.companies c WHERE c.name = 'Element AI';

-- 插入以色列AI公司的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'IPO', 1000000000, ARRAY['NASDAQ', 'Public Market'], '2022-10-01'
FROM public.companies c WHERE c.name = 'Mobileye';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 200000000, ARRAY['Intel', 'BMW'], '2021-06-01'
FROM public.companies c WHERE c.name = 'Mobileye';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['Intel', 'BMW'], '2020-03-01'
FROM public.companies c WHERE c.name = 'Mobileye';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['Intel', 'BMW'], '2019-06-01'
FROM public.companies c WHERE c.name = 'Mobileye';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Acquisition', 1000000000, ARRAY['Google'], '2013-06-01'
FROM public.companies c WHERE c.name = 'Waze';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 200000000, ARRAY['Google'], '2012-06-01'
FROM public.companies c WHERE c.name = 'Waze';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['Google'], '2011-06-01'
FROM public.companies c WHERE c.name = 'Waze';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['Google'], '2010-06-01'
FROM public.companies c WHERE c.name = 'Waze';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 20000000, ARRAY['Google'], '2009-06-01'
FROM public.companies c WHERE c.name = 'Waze';

-- 插入澳大利亚AI公司的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 200000000, ARRAY['SoftBank', 'Alibaba'], '2023-09-01'
FROM public.companies c WHERE c.name = 'Canva';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['SoftBank', 'Alibaba'], '2022-06-01'
FROM public.companies c WHERE c.name = 'Canva';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['SoftBank', 'Alibaba'], '2021-06-01'
FROM public.companies c WHERE c.name = 'Canva';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 20000000, ARRAY['SoftBank', 'Alibaba'], '2020-06-01'
FROM public.companies c WHERE c.name = 'Canva';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 100000000, ARRAY['SoftBank', 'Alibaba'], '2021-01-01'
FROM public.companies c WHERE c.name = 'Atlassian';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 50000000, ARRAY['SoftBank', 'Alibaba'], '2020-06-01'
FROM public.companies c WHERE c.name = 'Atlassian';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 20000000, ARRAY['SoftBank', 'Alibaba'], '2019-06-01'
FROM public.companies c WHERE c.name = 'Atlassian';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 10000000, ARRAY['SoftBank', 'Alibaba'], '2018-06-01'
FROM public.companies c WHERE c.name = 'Atlassian';

-- 插入巴西AI公司的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series G', 1000000000, ARRAY['SoftBank', 'Alibaba'], '2021-12-01'
FROM public.companies c WHERE c.name = 'Nubank';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series F', 500000000, ARRAY['SoftBank', 'Alibaba'], '2021-06-01'
FROM public.companies c WHERE c.name = 'Nubank';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series E', 200000000, ARRAY['SoftBank', 'Alibaba'], '2020-06-01'
FROM public.companies c WHERE c.name = 'Nubank';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series D', 100000000, ARRAY['SoftBank', 'Alibaba'], '2019-06-01'
FROM public.companies c WHERE c.name = 'Nubank';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 50000000, ARRAY['SoftBank', 'Alibaba'], '2018-06-01'
FROM public.companies c WHERE c.name = 'Nubank';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 20000000, ARRAY['SoftBank', 'Alibaba'], '2017-06-01'
FROM public.companies c WHERE c.name = 'Nubank';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 10000000, ARRAY['SoftBank', 'Alibaba'], '2016-06-01'
FROM public.companies c WHERE c.name = 'Nubank';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 5000000, ARRAY['SoftBank', 'Alibaba'], '2015-06-01'
FROM public.companies c WHERE c.name = 'Nubank';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 200000000, ARRAY['SoftBank', 'Alibaba'], '2021-01-01'
FROM public.companies c WHERE c.name = 'StoneCo';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['SoftBank', 'Alibaba'], '2020-06-01'
FROM public.companies c WHERE c.name = 'StoneCo';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['SoftBank', 'Alibaba'], '2019-06-01'
FROM public.companies c WHERE c.name = 'StoneCo';

-- 插入墨西哥AI公司的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 300000000, ARRAY['SoftBank', 'Alibaba'], '2021-09-01'
FROM public.companies c WHERE c.name = 'Kavak';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 200000000, ARRAY['SoftBank', 'Alibaba'], '2021-03-01'
FROM public.companies c WHERE c.name = 'Kavak';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 100000000, ARRAY['SoftBank', 'Alibaba'], '2020-06-01'
FROM public.companies c WHERE c.name = 'Kavak';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 50000000, ARRAY['SoftBank', 'Alibaba'], '2019-06-01'
FROM public.companies c WHERE c.name = 'Kavak';

-- 插入阿根廷AI公司的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 200000000, ARRAY['SoftBank', 'Alibaba'], '2021-01-01'
FROM public.companies c WHERE c.name = 'MercadoLibre';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['SoftBank', 'Alibaba'], '2020-06-01'
FROM public.companies c WHERE c.name = 'MercadoLibre';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['SoftBank', 'Alibaba'], '2019-06-01'
FROM public.companies c WHERE c.name = 'MercadoLibre';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 20000000, ARRAY['SoftBank', 'Alibaba'], '2018-06-01'
FROM public.companies c WHERE c.name = 'MercadoLibre';

-- 插入南非AI公司的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 100000000, ARRAY['SoftBank', 'Alibaba'], '2021-01-01'
FROM public.companies c WHERE c.name = 'Dimension Data';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 50000000, ARRAY['SoftBank', 'Alibaba'], '2020-06-01'
FROM public.companies c WHERE c.name = 'Dimension Data';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 20000000, ARRAY['SoftBank', 'Alibaba'], '2019-06-01'
FROM public.companies c WHERE c.name = 'Dimension Data';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 10000000, ARRAY['SoftBank', 'Alibaba'], '2018-06-01'
FROM public.companies c WHERE c.name = 'Dimension Data';

-- 插入阿联酋AI公司的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 200000000, ARRAY['SoftBank', 'Alibaba'], '2021-01-01'
FROM public.companies c WHERE c.name = 'Careem';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['SoftBank', 'Alibaba'], '2020-06-01'
FROM public.companies c WHERE c.name = 'Careem';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 50000000, ARRAY['SoftBank', 'Alibaba'], '2019-06-01'
FROM public.companies c WHERE c.name = 'Careem';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 20000000, ARRAY['SoftBank', 'Alibaba'], '2018-06-01'
FROM public.companies c WHERE c.name = 'Careem';
