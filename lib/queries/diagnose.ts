import bigquery from "../bigquery";

export default async function runDiagnoseQuery() {
  const query = `
    SELECT
      date,
      variant_id,
      impressions,
      clicks,
      cost,
      conversions,
      revenue,
      source
    FROM \`statasphere-analytics.statasphere_mvp.performance_master\`
    ORDER BY date DESC
    LIMIT 20;
  `;

  const [job] = await bigquery.createQueryJob({ query });
  const [rows] = await job.getQueryResults();

  return rows;
}
