import Account from "@/components/Account";
function AccountsPage() {
  return (
    <div>
      <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", display: "flex", justifyContent: "center" }}>
        Accounts
      </h1>
      <Account />
    </div>
  );
}

export default AccountsPage;
