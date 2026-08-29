"use client";

import * as React from "react";
import { Calculator } from "lucide-react";

import { formatCurrency, formatPL, plClass } from "@/lib/format";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function IpoCalculatorPage() {
  const [applicationPrice, setApplicationPrice] = React.useState("");
  const [lotSize, setLotSize] = React.useState("");
  const [lots, setLots] = React.useState("");
  const [listingPrice, setListingPrice] = React.useState("");

  const appPrice = parseFloat(applicationPrice) || 0;
  const size = parseFloat(lotSize) || 0;
  const numLots = parseFloat(lots) || 0;
  const listPrice = parseFloat(listingPrice) || 0;

  const totalShares = size * numLots;
  const investment = totalShares * appPrice;
  const listingValue = totalShares * listPrice;
  const profitLoss = listingValue - investment;
  const profitPercent = investment > 0 ? (profitLoss / investment) * 100 : 0;

  const hasInput = totalShares > 0 && investment > 0;

  return (
    <div>
      <PageHeader
        title="IPO Calculator"
        description="Estimate profit or loss on an IPO application before you apply."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="applicationPrice">Application Price (₹)</Label>
              <Input
                id="applicationPrice"
                type="number"
                inputMode="decimal"
                value={applicationPrice}
                onChange={(e) => setApplicationPrice(e.target.value)}
                placeholder="e.g. 100"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lotSize">Lot Size</Label>
              <Input
                id="lotSize"
                type="number"
                inputMode="numeric"
                value={lotSize}
                onChange={(e) => setLotSize(e.target.value)}
                placeholder="e.g. 150"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lots">Number of Lots</Label>
              <Input
                id="lots"
                type="number"
                inputMode="numeric"
                value={lots}
                onChange={(e) => setLots(e.target.value)}
                placeholder="e.g. 1"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="listingPrice">Listing Price (₹)</Label>
              <Input
                id="listingPrice"
                type="number"
                inputMode="decimal"
                value={listingPrice}
                onChange={(e) => setListingPrice(e.target.value)}
                placeholder="e.g. 130"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            {!hasInput ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <Calculator className="size-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Enter application price, lot size and lots to see results.
                </p>
              </div>
            ) : (
              <dl className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs text-muted-foreground">Total Shares</dt>
                  <dd className="text-lg font-semibold text-foreground">{totalShares}</dd>
                </div>
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs text-muted-foreground">Investment</dt>
                  <dd className="text-lg font-semibold text-foreground">
                    {formatCurrency(investment)}
                  </dd>
                </div>
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs text-muted-foreground">Listing Value</dt>
                  <dd className="text-lg font-semibold text-foreground">
                    {formatCurrency(listingValue)}
                  </dd>
                </div>
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs text-muted-foreground">Profit / Loss</dt>
                  <dd className={`text-lg font-semibold ${plClass(profitLoss)}`}>
                    {formatPL(profitLoss)}
                  </dd>
                </div>
                <div className="col-span-2 flex flex-col gap-0.5 border-t border-border pt-4">
                  <dt className="text-xs text-muted-foreground">Profit %</dt>
                  <dd className={`text-2xl font-semibold ${plClass(profitLoss)}`}>
                    {profitPercent > 0 ? "+" : ""}
                    {profitPercent.toFixed(2)}%
                  </dd>
                </div>
              </dl>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
