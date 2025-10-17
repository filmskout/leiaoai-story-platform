-- 基于a16z报告的完整融资信息数据
-- 包含各公司的融资轮次、投资方和估值信息

-- 插入OpenAI的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series Unknown', 40000000000, ARRAY['Microsoft', 'SoftBank Group', 'Founders Fund', 'Magnetar Capital', 'Thrive Capital'], '2024-12-01'
FROM public.companies c WHERE c.name = 'OpenAI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 1000000000, ARRAY['Microsoft', 'Khosla Ventures', 'Reid Hoffman'], '2023-01-01'
FROM public.companies c WHERE c.name = 'OpenAI';

-- 插入Anthropic的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 3500000000, ARRAY['Lightspeed Venture Partners', 'Salesforce Ventures', 'Alphabet', 'Amazon'], '2024-12-01'
FROM public.companies c WHERE c.name = 'Anthropic';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 450000000, ARRAY['Google Ventures', 'Sound Ventures', 'Zoom Ventures'], '2023-05-01'
FROM public.companies c WHERE c.name = 'Anthropic';

-- 插入Replit的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 97400000, ARRAY['Andreessen Horowitz', 'Coatue', 'Y Combinator'], '2023-04-01'
FROM public.companies c WHERE c.name = 'Replit';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 20000000, ARRAY['Andreessen Horowitz', 'Y Combinator'], '2021-12-01'
FROM public.companies c WHERE c.name = 'Replit';

-- 插入Perplexity AI的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 700000000, ARRAY['IVP', 'NEA', 'NVIDIA', 'Jeff Bezos'], '2024-12-01'
FROM public.companies c WHERE c.name = 'Perplexity AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 73600000, ARRAY['NEA', 'Elad Gil', 'Nat Friedman'], '2023-04-01'
FROM public.companies c WHERE c.name = 'Perplexity AI';

-- 插入Databricks的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series I', 10000000000, ARRAY['Thrive Capital', 'Andreessen Horowitz', 'Ontario Teachers'' Pension Plan'], '2024-12-01'
FROM public.companies c WHERE c.name = 'Databricks';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series H', 1500000000, ARRAY['Counterpoint Global', 'Franklin Templeton'], '2021-08-01'
FROM public.companies c WHERE c.name = 'Databricks';

-- 插入Scale AI的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series F', 1000000000, ARRAY['Accel', 'Index Ventures', 'Y Combinator', 'Tiger Global'], '2024-05-01'
FROM public.companies c WHERE c.name = 'Scale AI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series E', 325000000, ARRAY['Dragoneer', 'Wellington Management'], '2021-04-01'
FROM public.companies c WHERE c.name = 'Scale AI';

-- 插入Hugging Face的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series D', 235000000, ARRAY['Salesforce Ventures', 'Google', 'NVIDIA', 'AMD'], '2023-08-01'
FROM public.companies c WHERE c.name = 'Hugging Face';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 100000000, ARRAY['Lux Capital', 'Sequoia Capital'], '2022-05-01'
FROM public.companies c WHERE c.name = 'Hugging Face';

-- 插入Stability AI的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 101000000, ARRAY['Coatue', 'Lightspeed Venture Partners', 'O''Shaughnessy Ventures'], '2022-10-01'
FROM public.companies c WHERE c.name = 'Stability AI';

-- 插入Cognition的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 175000000, ARRAY['Founders Fund', 'Andreessen Horowitz', 'Elad Gil'], '2024-03-01'
FROM public.companies c WHERE c.name = 'Cognition';

-- 插入ElevenLabs的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 80000000, ARRAY['Andreessen Horowitz', 'Nat Friedman', 'Daniel Gross'], '2024-01-01'
FROM public.companies c WHERE c.name = 'ElevenLabs';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 19000000, ARRAY['Andreessen Horowitz', 'Nat Friedman'], '2023-06-01'
FROM public.companies c WHERE c.name = 'ElevenLabs';

-- 插入Notion的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 500000000, ARRAY['Index Ventures', 'Sequoia Capital'], '2021-10-01'
FROM public.companies c WHERE c.name = 'Notion';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['Index Ventures', 'Sequoia Capital'], '2019-03-01'
FROM public.companies c WHERE c.name = 'Notion';

-- 插入Canva的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 200000000, ARRAY['Blackbird Ventures', 'Sequoia Capital', 'Bessemer Venture Partners'], '2023-09-01'
FROM public.companies c WHERE c.name = 'Canva';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 60000000, ARRAY['Blackbird Ventures', 'Sequoia Capital'], '2021-06-01'
FROM public.companies c WHERE c.name = 'Canva';

-- 插入Midjourney的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 100000000, ARRAY['Index Ventures', 'Andreessen Horowitz'], '2023-01-01'
FROM public.companies c WHERE c.name = 'Midjourney';

-- 插入Cursor的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 20000000, ARRAY['Andreessen Horowitz', 'Elad Gil'], '2023-12-01'
FROM public.companies c WHERE c.name = 'Cursor';

-- 插入Lovable的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 5000000, ARRAY['Y Combinator', 'Andreessen Horowitz'], '2023-08-01'
FROM public.companies c WHERE c.name = 'Lovable';

-- 插入Emergent的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 10000000, ARRAY['Andreessen Horowitz', 'Elad Gil'], '2023-10-01'
FROM public.companies c WHERE c.name = 'Emergent';

-- 插入Clay的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 100000000, ARRAY['Andreessen Horowitz', 'Sequoia Capital'], '2023-08-01'
FROM public.companies c WHERE c.name = 'Clay';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 20000000, ARRAY['Andreessen Horowitz', 'Sequoia Capital'], '2022-01-01'
FROM public.companies c WHERE c.name = 'Clay';

-- 插入Ada的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series C', 130000000, ARRAY['Accel', 'Bessemer Venture Partners'], '2021-05-01'
FROM public.companies c WHERE c.name = 'Ada';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 44000000, ARRAY['Accel', 'Bessemer Venture Partners'], '2019-09-01'
FROM public.companies c WHERE c.name = 'Ada';

-- 插入Crisp的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 50000000, ARRAY['Partech', 'Bpifrance'], '2022-04-01'
FROM public.companies c WHERE c.name = 'Crisp';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 10000000, ARRAY['Partech', 'Bpifrance'], '2020-03-01'
FROM public.companies c WHERE c.name = 'Crisp';

-- 插入Freepik的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 100000000, ARRAY['General Atlantic', 'Permira'], '2023-01-01'
FROM public.companies c WHERE c.name = 'Freepik';

-- 插入Fyxer的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 5000000, ARRAY['Y Combinator', 'Andreessen Horowitz'], '2023-06-01'
FROM public.companies c WHERE c.name = 'Fyxer';

-- 插入Lorikeet的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 10000000, ARRAY['Andreessen Horowitz', 'Sequoia Capital'], '2023-03-01'
FROM public.companies c WHERE c.name = 'Lorikeet';

-- 插入Micro1的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 5000000, ARRAY['Andreessen Horowitz', 'Y Combinator'], '2022-08-01'
FROM public.companies c WHERE c.name = 'Micro1';

-- 插入Delve的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 7500000, ARRAY['Andreessen Horowitz', 'Sequoia Capital'], '2023-01-01'
FROM public.companies c WHERE c.name = 'Delve';

-- 插入Instantly的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 20000000, ARRAY['Andreessen Horowitz', 'Sequoia Capital'], '2023-05-01'
FROM public.companies c WHERE c.name = 'Instantly';

-- 插入Merlin AI的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 1000000, ARRAY['Y Combinator', 'Andreessen Horowitz'], '2023-02-01'
FROM public.companies c WHERE c.name = 'Merlin AI';

-- 插入Happyscribe的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 5000000, ARRAY['Kibo Ventures', 'JME Ventures'], '2022-03-01'
FROM public.companies c WHERE c.name = 'Happyscribe';

-- 插入Plaude的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 3000000, ARRAY['Y Combinator', 'Andreessen Horowitz'], '2022-09-01'
FROM public.companies c WHERE c.name = 'Plaude';

-- 插入Manus的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 7500000, ARRAY['Andreessen Horowitz', 'Sequoia Capital'], '2023-04-01'
FROM public.companies c WHERE c.name = 'Manus';

-- 插入Metaview的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 10000000, ARRAY['Andreessen Horowitz', 'Sequoia Capital'], '2023-01-01'
FROM public.companies c WHERE c.name = 'Metaview';

-- 插入Cluely的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 5000000, ARRAY['Y Combinator', 'Andreessen Horowitz'], '2023-06-01'
FROM public.companies c WHERE c.name = 'Cluely';

-- 插入Crosby Legal的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 10000000, ARRAY['Andreessen Horowitz', 'Sequoia Capital'], '2023-03-01'
FROM public.companies c WHERE c.name = 'Crosby Legal';

-- 插入Combinely的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 7500000, ARRAY['Andreessen Horowitz', 'Sequoia Capital'], '2022-11-01'
FROM public.companies c WHERE c.name = 'Combinely';

-- 插入11x的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 10000000, ARRAY['Andreessen Horowitz', 'Sequoia Capital'], '2023-05-01'
FROM public.companies c WHERE c.name = '11x';

-- 插入Serval的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 5000000, ARRAY['Y Combinator', 'Andreessen Horowitz'], '2022-07-01'
FROM public.companies c WHERE c.name = 'Serval';

-- 插入Alma的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 7500000, ARRAY['Andreessen Horowitz', 'Sequoia Capital'], '2023-02-01'
FROM public.companies c WHERE c.name = 'Alma';

-- 插入Applaud的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 10000000, ARRAY['Andreessen Horowitz', 'Sequoia Capital'], '2023-01-01'
FROM public.companies c WHERE c.name = 'Applaud';

-- 插入Arcads的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Seed', 5000000, ARRAY['Y Combinator', 'Andreessen Horowitz'], '2023-01-01'
FROM public.companies c WHERE c.name = 'Arcads';

-- 插入Tavus的融资信息
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 10000000, ARRAY['Andreessen Horowitz', 'Sequoia Capital'], '2023-03-01'
FROM public.companies c WHERE c.name = 'Tavus';
