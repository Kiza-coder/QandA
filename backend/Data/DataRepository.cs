using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SqlClient;
using Dapper;
using QandA.Data.Models;

namespace QandA.Data
{
    public class DataRepository: IDataRepository
    {
        private readonly string _connectionString;

        public DataRepository(IConfiguration configuration)
        {
            _connectionString =
            configuration["ConnectionStrings:DefaultConnection"];
        }

        public IEnumerable<QuestionGetManyResponse> GetQuestions()
        {
        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();
            return connection.Query<QuestionGetManyResponse>(
            @"CALL Question_Get_Many"
            );
        }
}

        

    }
}